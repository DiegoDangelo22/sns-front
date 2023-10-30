import { ReactNode, createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchResults, setSearchResults] = useState([]);

    return (
        <SearchContext.Provider value={{ searchResults, setSearchResults }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = ():any => {
    return useContext(SearchContext);
};