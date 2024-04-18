interface ListItem {
  value: number;
  label: string;
}
type Props = {
  list: ListItem[];
  handleChecked: (index: number) => void;
}

export default function List({ list, handleChecked }: Props) {
  return (
    <>
      {
        list.map(({ label, value }, index) => 
          <div className='content-list-row' key={value}>
            <input className='checkbox' type="checkbox" onChange={() => handleChecked(index)} />
            {label}
          </div>)
      }
    </>
  )
}
