import { toast, cssTransition } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const bounce = cssTransition({
    enter: "animate__animated animate__bounceIn",
    exit: "animate__animated animate__bounceOut"
});

// https://animista.net/
// source animation inside style.css
const wobble = cssTransition({
    enter: "wobble-hor-bottom",
    exit: "wobble-hor-top"
});

const initOpts = {
    position: toast.POSITION.TOP_CENTER,
    icon: true,
    hideProgressBar: true,
    draggable: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    autoClose: 3000
};

const Message = ({ toastName, toastContent }) => (
  <div>
    <h4 style={{ margin: 0 }}>{toastName}</h4>
    <h5 style={{ margin: 0, marginTop: '10px' }}>{toastContent}</h5>
  </div>
);

export function toastSuccessBounce(text) {
    toast.success("👌 " + text, {
        ...initOpts,
        theme: "colored",
        transition: bounce
    });
}

export function toastErrorBounce(name, message) {
  toast.error(<Message toastName={'👋 ' + name} toastContent={message} />, {
    ...initOpts,
    position: toast.POSITION.TOP_RIGHT,
    transition: bounce,
  });
}

export function toastDarkBounce(name, message) {
    toast.dark(<Message toastName={'👋 ' + name} toastContent={message} />, {
      ...initOpts,
      transition: bounce,
    });
}

export function toastSuccessSwirl(text) {
    toast.success("👌 " + text, {
        ...initOpts,
        theme: "colored",
        transition: wobble
    });
}

export function toastWarningSwirl(text) {
    toast.warning("👋 " + text, {
        ...initOpts,
        position: toast.POSITION.TOP_RIGHT,
        transition: wobble
    });
}

export function toastDarkSwirl(text) {
    toast.dark("👋 " + text, {
        ...initOpts,
        transition: wobble
    });
}
