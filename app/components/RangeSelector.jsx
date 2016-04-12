import React from 'react';
import AutoComplete from 'material-ui/lib/auto-complete';

const yearPrefix = '20'
const minYear = 10;
const maxYear = 99;
const dataSource = [];
for (let i = minYear; i <= maxYear; i++) {
  dataSource.push(String(i));
}

/**
 * This function strips the given number and return the last two digit of the number.
 * WARNING: The return type is a string.
 *
 * @param year {Number} - Number for operation.
 * @returns {String} - Last two digit of the number.
 */
function yearStrip(year) {
  return String(year).slice(2);
}

function processProps(props) {
  return {
    searchText: yearStrip(props.value),
    onUpdateInput(searchText) {
      props.onChange(Number(yearPrefix + searchText));
    }
  }
}

export default function RangeSelector(props) {
  return (
    <div>
      <spam>從西曆 {yearPrefix}</spam>
      <AutoComplete dataSource={dataSource} hintText="年份" {...processProps(props.start)} />
      <spam> 年 正月初一 重複至 西曆 {yearPrefix}</spam>
      <AutoComplete dataSource={dataSource} hintText="年份" {...processProps(props.end)} />
      <spam> 年 正月初一 的前一天</spam>
    </div>
  );
}
