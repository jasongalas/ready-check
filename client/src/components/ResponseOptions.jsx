import React, { useState } from 'react';

function ResponseOptions({ responseOptions, setResponseOptions }) {
    const [option, setOption] = useState('');

    const addOption = () => {
        if (option) {
            setResponseOptions([...responseOptions, option]);
            setOption('');
        }
    };

    return (
        <div>
            <label>Response Options</label>
            <div>
                <input
                    type="text"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                />
                <button type="button" onClick={addOption}>Add Option</button>
            </div>
            <ul>
                {responseOptions.map((opt, index) => (
                    <li key={index}>{opt}</li>
                ))}
            </ul>
        </div>
    );
}

export default ResponseOptions;
