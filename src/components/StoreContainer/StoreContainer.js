import React from 'react';
import pt from 'prop-types';
import { map, get } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import t from './translation.json';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

import StoreAccordion from './StoreAccordion/StoreAccordion';
// Css
import classes from './StoreContainer.scss';

@withStyles(classes)
@withLocales(t)
class StoreContainer extends React.PureComponent {
  static propTypes = {
    locations: pt.arrayOf(pt.object).isRequired,
    selectedId: pt.any,
    setPickupStore: pt.func,
  };

  state = {
    allStores: [],
  };

  /**
   * Life cycle
   */
  componentDidMount() {
    const tempStores = [...this.props.locations];
    map(tempStores, storeDetail => {
      storeDetail['isExpand'] = false;
      storeDetail['isHidden'] = false;
      storeDetail['districtFull'] = get(
        storeDetail,
        'extension_attributes.additional_address_info.district',
      );
      storeDetail['provinceFull'] = get(
        storeDetail,
        'extension_attributes.additional_address_info.region_name',
      );
    });

    this.setState({
      allStores: tempStores,
    });
  }

  /**
   * Methods
   */
  handleSelectStore = selectedStore => {
    const tempAllStores = [...this.state.allStores];
    const { selectedId } = this.props;
    map(tempAllStores, storeDetail => {
      if (selectedStore.id === storeDetail.id) {
        if (selectedId === storeDetail.id) {
          storeDetail.isExpand = true;
        } else {
          storeDetail.isExpand = !storeDetail.isExpand;
        }
      } else if (selectedId === storeDetail.id) {
        storeDetail.isExpand = true;
      } else {
        storeDetail.isExpand = false;
      }
    });

    this.setState({
      allStores: tempAllStores,
    });
  };

  filteredAllStores = event => {
    const searchInput = event.target.value
      ? event.target.value.toLowerCase()
      : '';
    const { allStores } = this.state;
    const tempAllStores = [...allStores];

    tempAllStores.map(storeDetail => {
      const { name, districtFull, provinceFull } = storeDetail;
      const storeName = name.toLowerCase();
      const storeDistrictFull = districtFull.toLowerCase();
      const storeProvinceFull = provinceFull.toLowerCase();

      // check store name and address
      if (searchInput) {
        if (
          storeName.indexOf(searchInput) >= 0 ||
          storeDistrictFull.indexOf(searchInput) >= 0 ||
          storeProvinceFull.indexOf(searchInput) >= 0
        ) {
          storeDetail.isHidden = false;
        } else {
          storeDetail.isHidden = true;
        }
      } else {
        storeDetail.isHidden = false;
      }
    });

    this.setState({
      allStores: tempAllStores,
    });
  };

  /**
   * Render
   */
  render() {
    const { selectedId, translate } = this.props;
    const { allStores } = this.state;

    return (
      <div className={classes.StoreContainer}>
        <h3>{translate('labelSelectStore')}</h3>
        <div className={classes.ContainerFilter}>
          <input
            id={generateElementId(
              ELEMENT_TYPE.TEXT,
              ELEMENT_ACTION.SEARCH,
              'Store',
              '',
            )}
            type="text"
            className={classes.InputFilter}
            onChange={this.filteredAllStores}
            placeholder={translate('placeholderFilter')}
          />
        </div>

        <div className={classes.ListStores}>
          {allStores.length > 0 &&
            map(allStores, storeDetail => (
              <StoreAccordion
                id={generateElementId(
                  ELEMENT_TYPE.RADIO,
                  ELEMENT_ACTION.ADD,
                  'Store',
                  '',
                  get(storeDetail, 'id', null),
                )}
                key={storeDetail.id}
                storeDetail={storeDetail}
                isExpand={storeDetail.isExpand}
                isHidden={storeDetail.isHidden}
                selectedId={selectedId}
                onSelectedStore={this.handleSelectStore}
                onSetStore={this.props.setPickupStore}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default StoreContainer;
