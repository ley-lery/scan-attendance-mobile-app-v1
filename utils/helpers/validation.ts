import * as Yup from 'yup';
import { ValidationError } from 'yup';

export const createValidationHelper = (
  t: (key: string) => string,
  yup: typeof Yup,
  formikRef: React.RefObject<any>,
  setFormErrors: (errors: string[]) => void
) => ({
  validate: (value: any, schema: Yup.Schema<any>) => {
    try {
      schema.validateSync(value, { abortEarly: false });
      return true;
    } catch (err) {
      const error = err as ValidationError;
      const errors = error.errors || [];
      setFormErrors(errors);

      // Optional: only if scrollToInput is implemented
      if (formikRef.current && error.path) {
        const fieldRef = formikRef.current?.getFieldProps(error.path)?.ref?.current;
        if (fieldRef) {
          fieldRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      return false;
    }
  },
  required: (message: string) => yup.string().required(message),
  email: (message: string) => yup.string().email(message),
  min: (min: number, message: string) => yup.string().min(min, message),
  max: (max: number, message: string) => yup.string().max(max, message),
  minLength: (min: number, message: string) => yup.string().min(min, message),
  maxLength: (max: number, message: string) => yup.string().max(max, message),
  number: (message: string) => yup.number().typeError(message),
  date: (message: string) => yup.date().typeError(message),
  url: (message: string) => yup.string().url(message),
  password: (message: string) => yup.string().min(1, message),
  confirmPassword: (field: string, message: string) => yup.string().oneOf([yup.ref(field), undefined], message),
  phoneNumber: (message: string) => yup.string().matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, message),
  idNumber: (message: string) => yup.string().matches(/^[0-9]{13}$/, message),
  numeric: (message: string) => yup.string().matches(/^[0-9]*$/, message),
  idCard: (message: string) => yup.string().matches(/^[0-9]{12}$/, message),
  idCard2: (message: string) => yup.string().matches(/^[0-9]{13}$/, message),
  idCard3: (message: string) => yup.string().matches(/^[0-9]{16}$/, message),
  creditCard: (message: string) => yup.string().matches(/^[0-9]{16}$/, message),
});
