type Props = {
  counter: number
}

export default function Main(props: Props) {
  return <main>主页{props.counter}</main>
}
