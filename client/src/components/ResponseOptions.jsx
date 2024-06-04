import React, { useState } from 'react';

function ResponseOptions({ responseOptions, setResponseOptions }) {
    const [option, setOption] = useState('');

    const addOption = () => {
        if (option) {
            setResponseOptions([...responseOptions, { text: option, value: 'pending' }]);
            setOption('');
        }
    };

    const handleOptionValueChange = (index, value) => {
        const newOptions = [...responseOptions];
        newOptions[index].value = value;
        setResponseOptions(newOptions);
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
                    <li key={index}>
                        <input
                            type="text"
                            value={opt.text}
                            readOnly
                        />
                        <select
                            value={opt.value}
                            onChange={(e) => handleOptionValueChange(index, e.target.value)}
                        >
                            <option value="accepted">Accepted</option>
                            <option value="denied">Denied</option>
                            <option value="accepted-late">Accepted Late</option>
                            <option value="pending">Pending</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ResponseOptions;
