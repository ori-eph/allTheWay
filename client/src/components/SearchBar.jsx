import { useRef, useState } from "react";
import "../css/SearchBar.css";

function SearchBar(props) {
  const [search, setSearch] = useState("");
  const searchParm = useRef("auto");

  if (props.autoSearch) {
    getSearchResults();
  }

  function getSearchResults() {
    props.setErr(null);

    if (!search) {
      props.setResList(null);
    } else {
      let result = [];
      if (searchParm.current.value === "auto") {
        result = props.list.filter((item) => {
          for (const value of Object.values(item)) {
            if (value.toString().toLowerCase().includes(search.toLowerCase())) {
              return true;
            }
          }
          return false;
        });
      } else {
        result = props.list.filter((item) => {
          return item[searchParm.current.value]
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase());
        });
      }
      if (result.length > 0) {
        props.setResList(result.map((result) => result.id));
      } else {
        props.setResList([]);
        props.setErr(Error("no matching results."));
      }
    }
  }

  return (
    <div id="searchBar">
      <input
        type="search"
        placeholder={`search by...(select search param in box)`}
        name="search"
        id="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <select ref={searchParm}>
        <option value="auto">auto</option>
        {props.searchBy?.map((searchParm) => {
          return (
            <option value={searchParm} key={searchParm}>
              {searchParm}
            </option>
          );
        })}
      </select>
      <button onClick={getSearchResults}>🔍</button>
    </div>
  );
}

export default SearchBar;
