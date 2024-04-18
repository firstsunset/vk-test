type Props = {
  value: string,
  handleSearch: (e: { target: { value: string; }; }) => void;
}
export default function Search({ value, handleSearch }: Props) {
  return (
    <div className='content-search-block'>
      <input 
        className='content-search' 
        type="text" 
        placeholder='Имя'
        value={value}
        onChange={(e) => handleSearch(e)}
      />
    </div>
  )
}
