

const Burger = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#FFFFFF"
      {...props}
    >
      <path
        d="M4 18L20 18"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>
      <path
        d="M4 12L20 12"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>
      <path
        d="M4 6L20 6"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>
    </svg>
  )
}

export default Burger
