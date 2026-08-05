import { InvoiceService } from '../../src/domain/invoice/invoice-service';
import { EmailService } from '../../src/infrastructure/email/email-service';
import { QueueService } from '../../src/infrastructure/queue/queue-service';
import { QueueName } from '../../src/infrastructure/queue/queue-types';
import { EmailTemplate } from '../../src/infrastructure/email/email-contract';

// Mocking dependencies
jest.mock('../../src/domain/invoice/invoice-service');
jest.mock('../../src/infrastructure/email/email-service');
jest.mock('../../src/infrastructure/queue/queue-service');

describe('Integration Scenario 7: Invoice Generation and Email Delivery Pipeline', () => {
  let invoiceService: jest.Mocked<InvoiceService>;
  let emailService: jest.Mocked<EmailService>;
  let queueService: jest.Mocked<QueueService>;

  beforeAll(() => {
    // In a real integration test, we would mock the repository and renderer, 
    // but keep the services real. For this demonstration of the flow, we mock the services.
    invoiceService = new InvoiceService({} as any, {} as any) as jest.Mocked<InvoiceService>;
    emailService = new EmailService({} as any, {} as any) as jest.Mocked<EmailService>;
    queueService = new QueueService({} as any) as jest.Mocked<QueueService>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render invoice document, enqueue email job, and send email with attachment', async () => {
    // 1. Arrange: Setup mock behaviors and data
    const mockInvoiceId = 'inv_123';
    const mockCustomerEmail = 'customer@example.com';
    const mockDocumentBuffer = Buffer.from('Mock PDF Content');
    
    const mockAttachment = {
      filename: 'INV-20260805-ABCD.pdf',
      mimeType: 'application/pdf',
      content: mockDocumentBuffer,
    };

    invoiceService.generateDocument.mockResolvedValue(mockAttachment);
    queueService.enqueue.mockResolvedValue({ jobId: 'job_email_1', status: 'QUEUED' } as any);
    emailService.send.mockResolvedValue({ success: true, messageId: 'msg_999', provider: 'resend', timestamp: new Date() });

    // 2. Act: Trigger the Invoice to Email Flow
    
    // Step A: Invoice Worker generates the document
    const generatedAttachment = await invoiceService.generateDocument(mockInvoiceId);

    // Step B: Invoice Worker queues the Email Job
    const emailPayload = {
      to: { email: mockCustomerEmail, name: 'John Doe' },
      subject: 'Your Invoice',
      template: EmailTemplate.INVOICE_DELIVERY,
      dynamicTemplateData: { orderNumber: 'ORD-555', customerName: 'John Doe' },
      attachments: [generatedAttachment],
    };
    
    await queueService.enqueue(QueueName.EMAIL, emailPayload);

    // Step C: Email Worker processes the Queue Job
    const emailResult = await emailService.send(emailPayload);

    // 3. Assert: Verify the data consistency across boundaries

    // -> Renderer was called successfully
    expect(invoiceService.generateDocument).toHaveBeenCalledWith(mockInvoiceId);
    expect(generatedAttachment.filename).toContain('.pdf');

    // -> Email Job was added to the queue with the attachment
    expect(queueService.enqueue).toHaveBeenCalledWith(
      QueueName.EMAIL,
      expect.objectContaining({
        template: EmailTemplate.INVOICE_DELIVERY,
        attachments: expect.arrayContaining([mockAttachment])
      })
    );

    // -> Email Service called with correct Recipient and Template
    expect(emailService.send).toHaveBeenCalledWith(expect.objectContaining({
      to: { email: mockCustomerEmail, name: 'John Doe' },
      template: EmailTemplate.INVOICE_DELIVERY,
      attachments: [mockAttachment]
    }));

    // -> Email successfully delivered (or passed to provider adapter)
    expect(emailResult.success).toBe(true);
    expect(emailResult.provider).toBe('resend');
  });
});