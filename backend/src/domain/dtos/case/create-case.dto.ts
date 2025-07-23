export interface CreateCaseDTO {
  referenceCode: string;
  caseType: string;
  startDate: string;
  details: string;
  clientId: number;
  lawyerId: number;
}
