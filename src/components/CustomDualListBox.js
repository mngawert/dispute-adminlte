import React, { useState } from 'react';

const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'orange', label: 'Orange' },
    { value: 'pear', label: 'Pear' },
    { value: 'grape', label: 'Grape' },
    { value: 'banana', label: 'Banana' },
];

const CustomDualListBox = () => {
    const [leftList, setLeftList] = useState(options);
    const [rightList, setRightList] = useState([]);
    const moveAllRight = () => {
        setRightList([...rightList, ...leftList]);
        setLeftList([]);
    };

    const moveAllLeft = () => {
        setLeftList([...leftList, ...rightList]);
        setRightList([]);
    };
    const moveRight = () => {
        const selected = Array.from(document.querySelector('#leftSelect').selectedOptions).map(option => option.value);
        setRightList([...rightList, ...leftList.filter(item => selected.includes(item.value))]);
        setLeftList(leftList.filter(item => !selected.includes(item.value)));
    };

    const moveLeft = () => {
        const selected = Array.from(document.querySelector('#rightSelect').selectedOptions).map(option => option.value);
        setLeftList([...leftList, ...rightList.filter(item => selected.includes(item.value))]);
        setRightList(rightList.filter(item => !selected.includes(item.value)));
    };

    return (
        <div>
            <h1>Custom Dual Listbox Example</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
                <select id="leftSelect" multiple size="5">
                    {leftList.map(item => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <button onClick={moveRight}>{'>>'}</button>
                <button onClick={moveAllRight}>{'>>'}</button>
                <button onClick={moveLeft}>{'<<'}</button>
                <button onClick={moveAllLeft}>{'<<'}</button>
                </div>
                <select id="rightSelect" multiple size="5">
                    {rightList.map(item => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CustomDualListBox;
