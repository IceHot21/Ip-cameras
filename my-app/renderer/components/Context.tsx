/* import { FC, ReactNode, useContext, useState, createContext } from 'react';

interface ContextProps {
    buildingCount: number;
    setBuildingCount: (count: number) => void;
}

const Context = createContext<ContextProps | undefined>(undefined);

const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [buildingCount, setBuildingCount] = useState<number>(0);

    return (
        <Context.Provider value={{ buildingCount, setBuildingCount }}>


            {children}
        </Context.Provider>
    )
}

const useSettings = () => {
    const context = useContext(Context);
    if(context === undefined) {
        throw new Error('useSettings должен использоваться внутри SettingsProvider');
    }
    return context;
}

export { ContextProvider, useSettings }; */