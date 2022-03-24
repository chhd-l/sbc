type TMapping = {
  [x: string]: string
}

const tabNameMapping: TMapping = {
  "basic": "Basic information",
  "shareholders": "Shareholder",
  "signatories": "Signatories",
  "bank": "Bank information"
};

const fieldNameMapping: TMapping = {
  "typeOfBusiness": "Type of business",
  "legalBusinessName": "Legal company name",
  "chamberOfCommerceNumber": "Chamber of Commerce number",
  "storeName": "Store name",
  "storeDomain": "Store domain",
  "taxId": "Tax ID",
  "storeAddress1": "Street name",
  "houseNumberOrName": "House number",
  "postCode": "Postcode",
  "cityId": "City",
  "city": "City",
  "email": "Email",
  "phoneNumber": "Phone number",
  "firstName": "First name",
  "lastName": "Last name",
  "gender": "Gender",
  "address1": "Address 1",
  "dateOfBirth": "Date of birth",
  "document": "Supported document",
  "shareholderType": "Shareholder type",
  "jobTitle": "Job title",
  "province": "Province",
  "ownerName": "Owner name",
  "iban": "IBAN"
};

export default function MapKeyToDisplayName(key: string) {
  if (key.indexOf('.') > -1) {
    return key.split('.').map((item, idx) => idx === 0 ? (tabNameMapping[item] ?? 'Others') : (fieldNameMapping[item] ?? 'Others')).join(' -- ');
  }
  return fieldNameMapping[key];
};
