import { DateFromString } from "@pagopa/ts-commons/lib/dates";
/**
 * New User profile data
 */
type NewProfileData = {
  name: string;
  familyName: string;
  fiscalCode: string;
  email: string;
  dateOfBirth: DateFromString | undefined;
};

export default NewProfileData;
