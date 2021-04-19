const calcPercentage = (firstNumber, secondNumber) => {
  if (secondNumber === 0) {
    return 100;
  }
  if (Number.isNaN(firstNumber)
  || Number.isNaN(secondNumber)
  || !secondNumber) {
    return '-';
  }
  return Math.round(((firstNumber - secondNumber) / secondNumber) * 100);
};

export default calcPercentage;
