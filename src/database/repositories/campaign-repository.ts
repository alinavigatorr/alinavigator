import { BaseRepository } from './base-repository';

/**
 * Campaign Repository Contract
 * Extends the generic base repository with campaign-specific query methods.
 */
export interface CampaignRepository<TCampaign, TCreateDTO, TUpdateDTO> 
  extends BaseRepository<TCampaign, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves all currently running (active) campaigns.
   */
  findRunning(): Promise<TCampaign[]>;

  /**
   * Retrieves all scheduled (future) campaigns.
   */
  findScheduled(): Promise<TCampaign[]>;
}