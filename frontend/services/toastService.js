import Toast from 'react-native-toast-message';

class ToastService {
  // Show success message
  success(message, title = 'Success') {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  }

  // Show error message
  error(message, title = 'Error') {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  }

  // Show info message
  info(message, title = 'Info') {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  }

  // Show warning message
  warning(message, title = 'Warning') {
    Toast.show({
      type: 'warning',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3500,
      autoHide: true,
      topOffset: 50,
    });
  }

  // Hide current toast
  hide() {
    Toast.hide();
  }
}

export default new ToastService();
