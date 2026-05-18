type SearchInputProps = {
  search: string;
  setSearch: (value: string) => void;
};

export const SearchInput = ({ search, setSearch }: SearchInputProps) => {
  return (
    <div>
      {' '}
      <input
        className="border p-2 mt-4"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};
