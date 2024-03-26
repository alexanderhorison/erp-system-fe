const initialState = {
  userInfo: {},
  accessMenu: [],
  successToast: false,
  modalSuccess: false,
  modalError: false,
  modalWarning: false,
  redirectPath: "",
  successMessage: "",
  warningMessage: "",
  errorTitle: "",
  errorMessage: "",
  message: "",
  openNavbar: true,
  modalConfirmSave: false,
  modalConfirmSaveNewsletter: false,
  url: "",
  method: "",
  data: "",
  params: "",
  title: "",
  messageModalSave: "",
  handleSuccess: () => {}
};

export default function reduxState(state = initialState, { type, ...rest }) {
  switch (type) {
    case "SET":
      return {
        ...state,
        ...rest,
      };
    default:
      return state;
  }
}
