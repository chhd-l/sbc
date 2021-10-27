type TMapping = {
  [x: string]: string
}

const tabNameMapping: TMapping = {
  "basicInformation": "Basic information",
  "hareholder": "Shareholder",
  "ignatories": "Signatories",
  "bankInformation": "Bank information"
};

const fieldNameMapping: TMapping = {
  "typeOfBusiness": "Type of business",
  "legalBusinessName": "Legal company name",
  "chamberOfCommerceNumber": "Chamber of Commerce number",
  "storeName": "Store name",
  "storeDomain": "Store domain",
  "storeAddress1": "Store address 1",
  "postCode": "Postcode",
  "cityId": "City",
  "city": "City",
  "email": "Email",
  "phoneNumber": "Phone number",
  "firstName": "First name",
  "lastName": "Last name",
  "address1": "Address 1",
  "dateOfBirth": "Date of birth",
  "supportedDocument": "Supported document",
  "shareholderType": "Shareholder type",
  "jobTitle": "Job title",
  "province": "Province",
  "ownerName": "Owner name",
  "iban": "IBAN"
};

export default function MapKeyToDisplayName(key: string) {
  if (key.indexOf('.') > -1) {
    return key.split('.').map((item, idx) => idx === 0 ? tabNameMapping[item] : fieldNameMapping[item]).join(' -- ');
  }
  return fieldNameMapping[key];
};
