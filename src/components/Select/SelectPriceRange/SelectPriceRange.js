import React from 'react';
import pt from 'prop-types';
import styled from 'styled-components';
import InputRange from 'react-input-range';

const InputTextStyled = styled.input.attrs({ type: 'text' })`
  width: 100%;
  border: 1px solid #b7b7b7;
  background-color: #ffffff;
  height: 30px;
  line-height: 30px;
  padding-left: 41px;
  font-size: 10px;
  margin-bottom: 11px;
  color: #1a1b1a;
  -moz-appearance: textfield;
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ::placeholder {
    color: #b9b9b9;
  }
`;
const LabelWrapper = styled.label`
  font-size: 12px;
  color: #7a7a7a;
  position: relative;
  ${props => props.customStyle || ''}
`;
const WrapperInput = styled.div`
  display: flex;
  width: 100%;
`;
const WrapperPriceRange = styled.div`
  padding: 0 7px;
  position: relative;
  .input-range__slider {
    appearance: none;
    background: white;
    border: 1px solid #17212c;
    border-radius: 100%;
    cursor: pointer;
    display: block;
    height: 1rem;
    margin-left: -0.5rem;
    margin-top: -0.65rem;
    outline: none;
    position: absolute;
    top: 50%;
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
    width: 1rem;
  }
  /* .input-range__slider:active {
    transform: scale(1.3);
  } */
  .input-range__slider:focus {
    box-shadow: 0 0 0 5px rgba(63, 81, 181, 0.2);
  }
  .input-range--disabled .input-range__slider {
    background: #cccccc;
    border: 1px solid #cccccc;
    box-shadow: none;
    transform: none;
  }
  .input-range__slider-container {
    transition: left 0.3s ease-out;
  }

  .input-range__label {
    color: #aaaaaa;
    font-size: 0.8rem;
    transform: translateZ(0);
    white-space: nowrap;
    display: none;
  }

  .input-range__label--min {
    left: 0;
  }

  .input-range__label--max {
    right: 0;
  }

  .input-range__label--value {
    position: absolute;
    top: -1.8rem;
  }

  .input-range__label-container {
    left: -50%;
    position: relative;
  }
  .input-range__label--max .input-range__label-container {
    left: 50%;
  }
  .input-range__track {
    background: #eaeaea;
    border-radius: 0.3rem;
    cursor: pointer;
    display: block;
    height: 0.3rem;
    position: relative;
    transition: left 0.3s ease-out, width 0.3s ease-out;
  }
  .input-range--disabled .input-range__track {
    background: #eaeaea;
  }

  .input-range__track--background {
    left: 0;
    margin-top: -0.15rem;
    position: absolute;
    right: 0;
    top: 50%;
  }

  .input-range__track--active {
    background: #17212c;
  }

  .input-range {
    height: 1rem;
    position: relative;
    width: 100%;
  }

  @media (max-width: 1024px) {
    padding: 0;
    padding-bottom: 10px;
    margin-top: 25px;
    display: flex;
    justify-content: center;
    .input-range__slider {
      background: #031932;
      border: 1px solid #031932;
      width: 1.5rem;
      height: 1.5rem;
    }
    .input-range {
      width: 95%;
    }
    .input-range__slider:focus {
      box-shadow: 0 0 0 5px rgba(63, 81, 181, 0.2);
    }
    .input-range--disabled .input-range__slider {
      background-color: #031932;
      border: 1px solid #031932;
      box-shadow: none;
      transform: none;
    }
    .input-range__track--active {
      background: #093565;
    }
    .input-range__slider-container {
      top: 2px;
    }
    .input-range__track {
      height: 0.4rem;
    }
    .input-range__label--min {
      display: block;
      position: absolute;
      left: 5px;
      top: -19px;
      color: #17212c;
    }
    .input-range__label--max {
      display: block;
      position: absolute;
      right: 12px;
      top: -19px;
      color: #17212c;
    }
    .input-range__slider {
      margin-left: -0.8rem;
      top: 0;
    }
  }
`;
const CurrencyStyled = styled.div`
  position: absolute;
  top: 23px;
  left: 32px;
  bottom: 0;
  right: 0;
`;

class SelectPriceRange extends React.PureComponent {
  static propTypes = {
    onChange: pt.func.isRequired,
    priceDefault: pt.object,
    priceRangeLimit: pt.object,
    isFilter: pt.bool,
  };

  static defaultProps = {
    priceDefault: { min: 0, max: 0 },
    priceRangeLimit: { min: 0, max: 0 },
    isFilter: false,
  };

  state = {
    textMin: 0,
    textMax: 0,
  };

  componentDidMount() {
    this.setState({
      textMin: this.props.priceDefault.min || 0,
      textMax: this.props.priceDefault.max || 0,
    });
  }
  componentDidUpdate(prevProps) {
    const { isFilter, priceDefault } = this.props;
    if (
      (isFilter !== prevProps.isFilter && !isFilter) ||
      prevProps.priceDefault.min !== priceDefault.min ||
      prevProps.priceDefault.max !== priceDefault.max
    ) {
      this.setState({
        textMin: priceDefault.min,
        textMax: priceDefault.max,
      });
    }
  }

  setPrice = (priceRange, callbackFc) => {
    this.setState(
      {
        textMin: priceRange.min,
        textMax: priceRange.max,
      },
      () => (callbackFc ? callbackFc(priceRange) : null),
    );
  };

  transformFormatPrice = price => {
    return `฿${Number(price).toLocaleString()}`;
  };

  removeFormatPrice = price => {
    return Number(price.toString().replace(new RegExp(',', 'g'), ''));
  };
  isNumber = value => {
    const price = this.removeFormatPrice(value);

    return String(price).match(/^\d+$/);
  };

  formatPrice = price => {
    const digitFormat = 0;
    const formatPrice = parseInt(price).toLocaleString('en-US', {
      minimumFractionDigits: digitFormat,
      maximumFractionDigits: digitFormat,
    });

    return formatPrice;
  };

  render() {
    const { priceRangeLimit } = this.props;
    const { textMin, textMax } = this.state;

    return (
      <>
        <WrapperInput>
          <LabelWrapper customStyle={`margin-right: 27px;`}>
            From
            <CurrencyStyled>฿</CurrencyStyled>
            <InputTextStyled
              value={this.formatPrice(textMin)}
              onChange={e => {
                const resultNumber = this.isNumber(e.target.value);

                if (resultNumber && resultNumber[0]) {
                  this.setState({ textMin: resultNumber[0] });
                }
              }}
              onBlur={e => {
                let priceMin = this.removeFormatPrice(e.target.value);

                if (priceMin > priceRangeLimit.max || priceMin > textMax) {
                  priceMin = textMax;
                } else if (priceMin < priceRangeLimit.min) {
                  priceMin = priceRangeLimit.min;
                }
                const value = {
                  min: parseInt(priceMin),
                  max: parseInt(textMax),
                };

                this.setPrice(value, this.props.onChange(value));
              }}
            />
          </LabelWrapper>
          <LabelWrapper>
            To
            <CurrencyStyled>฿</CurrencyStyled>
            <InputTextStyled
              value={this.formatPrice(textMax)}
              onChange={e => {
                const resultNumber = this.isNumber(e.target.value);

                if (resultNumber && resultNumber[0]) {
                  this.setState({ textMax: resultNumber[0] });
                }
              }}
              onBlur={e => {
                let priceMax = this.removeFormatPrice(e.target.value);

                if (priceMax > priceRangeLimit.max) {
                  priceMax = priceRangeLimit.max;
                } else if (
                  priceMax < priceRangeLimit.min ||
                  priceMax < textMin
                ) {
                  priceMax = textMin;
                }
                const value = {
                  min: parseInt(textMin),
                  max: parseInt(priceMax),
                };

                this.setPrice(value, this.props.onChange(value));
              }}
            />
          </LabelWrapper>
        </WrapperInput>
        <WrapperPriceRange>
          <InputRange
            formatLabel={value => `${this.transformFormatPrice(value)}`}
            maxValue={priceRangeLimit.max}
            minValue={priceRangeLimit.min}
            value={{
              min: this.removeFormatPrice(textMin),
              max: this.removeFormatPrice(textMax),
            }}
            draggableTrack
            onChange={value => {
              this.setPrice(value);
            }}
            onChangeComplete={value => {
              this.props.onChange(value)
            }}
          />
        </WrapperPriceRange>
      </>
    );
  }
}

export default SelectPriceRange;
