const ExhaustedBalanceBEErrorMessage = 'Your balance is exhausted';
const ExhaustedBalanceMessage = 'Số dư trong ví ASM không còn đủ';
const PermissionDeniedBEErrorMessage = 'Permission denied';
const PermissionDeniedMessage =
  'Take your experience to the next level with our premium features - top up today!';
const DifferentRefDomainBEErrorMessage = 'Ref must be same domain';
const DifferentRefDomainMessage = 'Các link ref phải có cùng domain';
const DefaultMessage = '  Your balance is exhausted';
const DuplicateCampaignIdBEErrorMessage = 'Campaign is existed.';
const DuplicateCampaignIdBEErrorCode = 555;
const DuplicateCampaignIdMessage = 'Mã chiến dịch này đã tồn tại';

export function checkResponseSuccess(res: any) {
  if (res && res.code === 200) return true;
  else return false;
}
export function checkAuthResponseSuccess(res: any) {
  if (res.code === 201) return true;
  else return false;
}
export function handleCatchException(
  error: any,
  msgService?: any,
  defaultMessage?: string
) {
  if (error?.error?.message === ExhaustedBalanceBEErrorMessage) {
    msgService.error(ExhaustedBalanceMessage);
  } else if (
    error?.error?.code === 403 &&
    error?.error?.message === PermissionDeniedBEErrorMessage
  ) {
    msgService.error(PermissionDeniedMessage);
  } else if (
    error?.error?.code === 404 &&
    error?.error?.message === DifferentRefDomainBEErrorMessage
  ) {
    msgService.error(DifferentRefDomainMessage);
  } else if (
    error?.error?.code === DuplicateCampaignIdBEErrorCode &&
    error?.error?.message === DuplicateCampaignIdBEErrorMessage
  ) {
    msgService.error(DuplicateCampaignIdMessage);
  } else {
    msgService.error(defaultMessage ?? DefaultMessage);
  }
}

function toPascalCase(str: string): string {
  return str.replace(/(^\w|_\w)/g, (match) =>
    match.replace('_', '').toUpperCase()
  );
}

export function convertObjectKeysToPascalCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertObjectKeysToPascalCase(item));
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = toPascalCase(key);
        newObj[newKey] = convertObjectKeysToPascalCase(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export function copyToClipboard(val: string) {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}
