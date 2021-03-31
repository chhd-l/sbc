import { Action, Actor, IMap } from 'plume2';

export default class FillinPetInfo extends Actor {
  defaultState() {
    return {
      "felinRecoId": null,
      "storeId": null,
      "apptId": null,
      "export": null,
      "paris": true,
      "pickup": false,
      "goodsQuantity": [
        {
          "goodsInfoNo": "8387427466",
          "quantity": 1
        },
      ],
      "appointmentVO": {},
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
      "prescriber": null
    }
  }

  @Action('order-return-list:form:field')
  formFieldChange(state: IMap, params) {
    return state.update('form', form => form.mergeDeep(params));
  }
}
