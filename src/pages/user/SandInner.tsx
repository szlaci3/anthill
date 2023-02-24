type RandomNumberType = {
  value: number
}

type PositiveType = RandomNumberType & {
  isPositive: true
  isNegative?: never // If has no ? , is required. Add ? because not required and add never because mustn't have it.  
  isZero?: never
}

type NegativeType = RandomNumberType & {
  isNegative: true
  isPositive?: never
  isZero?: never
}

type ZeroType = RandomNumberType & {
  isZero: true
  isPositive?: never
  isNegative?: never
}



type RandomNumberProps = PositiveType | NegativeType | ZeroType

export const RandomNumber = ({
  value,
  isPositive,
  isNegative,
  isZero,
}: RandomNumberProps) => {
  return (
    <div>
      {value} {isPositive && 'positive'} {isNegative && 'negative'} {' '} {isZero && 'zero'}
    </div>
  )
}