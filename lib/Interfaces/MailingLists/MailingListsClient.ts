import {
  CreateUpdateList, DestroyedList, ListsQuery, MailingList,
  MailingListCancelValidationResult, MailingListResult,
  MailingListValidationResult, StartValidationResult
} from '../../Types/MailingLists';

export interface IMailingListsClient {
  list(query?: ListsQuery): Promise<MailingListResult>
  get(mailListAddress: string): Promise<MailingList>
  create(data: CreateUpdateList): Promise<MailingList>
  update(mailListAddress: string, data: CreateUpdateList): Promise<MailingList>
  destroy(mailListAddress: string): Promise<DestroyedList>
  validate(mailListAddress: string): Promise<StartValidationResult>
  validationResult(mailListAddress: string): Promise<MailingListValidationResult>
  cancelValidation(mailListAddress: string): Promise<MailingListCancelValidationResult>
}
