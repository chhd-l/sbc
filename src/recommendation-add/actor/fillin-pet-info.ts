import { Action, Actor, IMap } from 'plume2';

export default class FillinPetInfo extends Actor {
  defaultState() {
    return {
      "felinRecoId": "Rsfjaljflfafsdfsdfsdf",
      "storeId": 123457909,
      "apptId": 190,
      "export": "export",
      "paris": true,
      "pickup": false,
      "customerPet": {
        "petsId": "",
        "petsType": "",
        "petsName": "",
        "petsSex": 1,
        "petsBreed": "",
        "sterilized": 0,
        "birthOfPets": "",
        "activity": null,
        "weight": null,
        "sensitivity": null,
      },
    }
  }

  @Action('order-return-list:form:field')
  formFieldChange(state: IMap, params) {
    return state.update('form', form => form.mergeDeep(params));
  }
}
