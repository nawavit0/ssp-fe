import React, { Fragment, memo } from 'react';
import styled from 'styled-components';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const LabelCheckBox = styled.label`
  min-width: 30px;
  text-align: center;
  border: 1px solid #b7b7b7;
  background-color: #ffffff;
  padding: 5px 5px;
  line-height: 30px;
  /* padding: 11px 5px 8px 5px; */
  display: inline-block;
  font-size: 12px;
  color: #1a1b1a;
  margin: 0 8px 8px 0;
  cursor: pointer;
  flex: auto;
`;
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const CheckBoxTextStyled = styled.input.attrs({ type: 'checkbox' })`
  -webkit-appearance: none;
  display: none;
  margin: 0;
  &:checked + ${LabelCheckBox} {
    background-color: #17212c;
    color: #ffffff;
  }
`;
const CountStyled = styled.span`
  color: #cccccc;
  font-size: 10px;
`;
const CheckBoxList = ({ list, limit, onChange, selectedList, uniqTextId }) => {
  let resultList = list;

  if (limit > 0 && list.length > limit) {
    resultList = resultList.slice(0, limit);
  }

  return (
    <Wrapper>
      {resultList.length
        ? resultList.map((item, index) => {
            const isSelected = selectedList.indexOf(item.value) !== -1;

            return (
              <Fragment key={`checkbox${index}`}>
                <CheckBoxTextStyled
                  id={generateElementId(
                    ELEMENT_TYPE.CHECKBOX,
                    ELEMENT_ACTION.CHECK,
                    uniqTextId,
                    'Plp',
                    item.value ? item.value.replace(' ', '') : '',
                  )}
                  onChange={() => onChange(item)}
                  checked={isSelected}
                />
                <LabelCheckBox
                  htmlFor={generateElementId(
                    ELEMENT_TYPE.CHECKBOX,
                    ELEMENT_ACTION.CHECK,
                    uniqTextId,
                    'Plp',
                    item.value ? item.value.replace(' ', '') : '',
                  )}
                >
                  {item.label || ''} <CountStyled>({item.count})</CountStyled>
                </LabelCheckBox>
              </Fragment>
            );
          })
        : null}
    </Wrapper>
  );
};

CheckBoxList.defaultProps = {
  limit: 0,
  list: [],
  onChange: () => null,
  selectedList: [],
  uniqTextId: '',
};

export default memo(CheckBoxList);
