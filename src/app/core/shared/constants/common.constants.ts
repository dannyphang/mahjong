export const LoginMode = {
    SignIn: 'SIGNIN',
    SignUp: 'SIGNUP',
    ForgotPassword: 'FORGOTPASSWORD',
}

export const ROW_PER_PAGE_DEFAULT = 10;
export const ROW_PER_PAGE_DEFAULT_LIST = [5, 10, 20, 50, 100];

export const NUMBER_OF_EXCEL_INSERT_ROW = 100;

export const EMPTY_VALUE_STRING = '--';

export const DEFAULT_FORMAT_DATE = 'DD/MM/YYYY';
export const DEFAULT_FORMAT_DATETIME = 'DD/MM/YYYY HH:mm:ss';
export const DATE_HOUR_MINUTES_UPPER_MERIDIEM = 'DD/MM/YYYY hh:mm A';
export const DATE_HOUR_MINUTES_SECONDS_UPPER_MERIDIEM = 'DD/MM/YYYY hh:mm:ss A';
export const EDITOR_CONTENT_LIMIT = 3000;
export const ATTACHMENT_MAX_SIZE = 10000000;
export const DEFAULT_PROFILE_PIC_URL = "https://firebasestorage.googleapis.com/v0/b/crm-project-9b8c9.appspot.com/o/Default%2Fprofile.png?alt=media&token=3dda3486-803b-4241-8752-b57b8299ffb1";

export const EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export const URL_REGEX = new RegExp(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(\.[a-zA-Z]{2,})+)(:[0-9]{1,5})?(\/[^\s]*)?$/);