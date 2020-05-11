import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * Add Clinic
 * @param filterParams
 */
export function addClinic(filterParams = {}) {
  return Fetch<TResult>('/clinics/addPrescription', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * Add Clinic
 * @param filterParams
 */
export function updateClinic(filterParams = {}) {
  return Fetch<TResult>('/clinics/upDatePrescription', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * Add Clinic
 * @param filterParams
 */
export function getClinicById(filterParams = {}) {
  return Fetch<TResult>('/clinics/prescriptionById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
