export const convertDateFormat = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

export const convertKRLocaleStringFormat = (number: number): string => {
  const string = number ? number.toLocaleString('ko-KR') : '0';

  return string;
};

export const convertKoreanStringFormat = (number: number): string => {
  const koreanUnits = ['조', '억', '만', ''];
  const unit = 10000;
  let answer = '';

  while (number > 0) {
    const mod = number % unit;
    const modToString = mod.toString().replace(/(\d)(\d{3})/, '$1,$2');
    number = Math.floor(number / unit);
    answer = `${modToString}${koreanUnits.pop()} ${answer}`;
  }

  return answer.slice(0, -1);
};

export const convertNumberToCSSBackground = (number: number): string => {
  if (number < 10) {
    return '#fbc400';
  } else if (number < 20) {
    return '#69c8f2';
  } else if (number < 30) {
    return '#ff7272';
  } else if (number < 40) {
    return '#aaa';
  } else {
    return '#b0d840';
  }
};

export const convertNumberToCSSTextShadow = (number: number): string => {
  if (number < 10) {
    return '0px 0px 3px rgba(73, 57, 0, 0.8)';
  } else if (number < 20) {
    return '0px 0px 3px rgba(0, 49, 70, 0.8)';
  } else if (number < 30) {
    return '0px 0px 3px rgba(64, 0, 0, 0.8)';
  } else if (number < 40) {
    return '0px 0px 3px rgba(61, 61, 61, 0.8)';
  } else {
    return '0px 0px 3px rgba(41, 56, 0, 0.8)';
  }
};
