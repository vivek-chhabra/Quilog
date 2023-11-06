import { useState } from "react";

const useToggle = (val) => {
    const [state, setState] = useState(val);

    const toggleState = () => {
        setState(!state);
    };

    return [state, toggleState];
};

export default useToggle;
