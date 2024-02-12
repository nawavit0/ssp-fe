import React from 'react';
import pt from 'prop-types';
import { get, map, filter, isEmpty } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import t from './translation.json';
import s from './LocationSelector.scss';
import cx from 'classnames';
import GoogleMapReact from 'google-map-react';
import Row from '../Row';
import Col from '../Col';
import controllable from 'react-controllables';

@withStyles(s)
@withLocales(t)
@controllable(['center', 'zoom', 'hoverKey', 'activeId', 'selectedId'])
class LocationSelector extends React.PureComponent {
  static propTypes = {
    apiKey: pt.string,
    loading: pt.bool,
    locations: pt.arrayOf(pt.object).isRequired,
    onChange: pt.func,
    activeId: pt.string,
    center: pt.shape({
      lat: pt.number,
      lng: pt.number,
    }),
    selectedId: pt.any,
    zoom: pt.number,
    onActiveIdChange: pt.func,
    onCenterChange: pt.func,
    onSelectedIdChange: pt.func,
    onZoomChange: pt.func,
  };

  state = {
    searchText: null,
    inputSearch: null,
  };

  static defaultProps = {
    // TODO: replace GCP API Key from .env
    apiKey: 'AIzaSyD-fVVeGu7sH3BvPvSAHzUxmZhxvpVAT38',
    center: {
      lat: 13.7482299,
      lng: 100.5412388,
    },
    zoom: 10,
  };

  handelFilterLocation = e => {
    e.preventDefault();

    this.setState({
      searchText: this.state.inputSearch,
    });
  };

  render() {
    const { loading, locations, translate } = this.props;
    const { searchText } = this.state;

    const locationFiltered = filter(locations, function(item) {
      if (isEmpty(searchText)) {
        return locations;
      }
      return String(item.name)
        .toLocaleLowerCase()
        .includes(String(searchText).toLocaleLowerCase());
    });

    return (
      <Row className={s.storeLocator}>
        <Col lg={4} sm={12}>
          <h3>{translate('selectStore')}</h3>
          <div className={s.search}>
            <div className="search-container">
              <form onSubmit={e => this.handelFilterLocation(e)}>
                <span className={s.title}>{translate('near_by_store')}</span>
                <input
                  type="text"
                  name="search"
                  onChange={e => this.setState({ inputSearch: e.target.value })}
                />
                <button type="submit">{translate('check_btn')}</button>
              </form>
            </div>
          </div>
          <div>
            {loading && <p>{'loading..'}</p>}
            <div className={s.select}>
              {map(locationFiltered, this.renderListItem)}
            </div>
          </div>
        </Col>
        <Col lg={8} sm={12}>
          <div className={s.mapView}>{this.renderMap()}</div>
        </Col>
      </Row>
    );
  }

  renderListItem = loc => {
    const { translate } = this.props;
    const handleClick = this.handleItemClick(loc);
    const selected = loc.id === this.props.selectedId;
    const className = cx(s.option, { [s.selected]: selected });
    const district = get(
      loc,
      'extension_attributes.additional_address_info.district',
    );
    const province = get(
      loc,
      'extension_attributes.additional_address_info.region_name',
    );
    const shortAddress = this.formatLine([district, province]);

    return (
      <div key={loc.id} className={className} onClick={handleClick}>
        <h4 className={s.name}>{loc.name}</h4>
        <div className={s.split}>
          <p className={s.short} title={shortAddress}>
            {shortAddress}
          </p>
          <div className={s.right}>
            <span className={s.blue}>{selected && translate('selected')}</span>
          </div>
        </div>
      </div>
    );
  };

  getLocation = pickupOption => {
    return get(pickupOption, 'extension_attributes.pickup_locations[0]');
  };

  formatLine = (values = []) => values.filter(v => !!v).join(', ');

  renderMap = () => {
    const { locations } = this.props;
    const { searchText } = this.state;

    const locationFiltered = filter(locations, function(item) {
      if (isEmpty(searchText)) {
        return locations;
      }
      return String(item.name)
        .toLocaleLowerCase()
        .includes(String(searchText).toLocaleLowerCase());
    });
    return (
      <div className={s.mapContainer}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: this.props.apiKey }}
          center={this.props.center}
          zoom={this.props.zoom}
          onChange={this.onBoundsChange}
          onChildClick={this.onChildClick}
        >
          {map(locationFiltered, this.renderMarker)}
        </GoogleMapReact>
      </div>
    );
  };

  renderMarker = location => {
    const {
      id,
      lat,
      long,
      name,
      telephone,
      address_line1,
      district,
      province,
      postal_code,
    } = location;

    const { translate } = this.props;
    const active = this.props.activeId === id; // NOTE: typeof id === 'string'
    const selected = this.props.selectedId === id;
    const icon = active ? 'ic-map-marker.svg' : 'ic-map-pin.svg';
    const className = cx(s.marker, { [s.active]: active });
    // address info
    const addressLine = this.formatLine([
      address_line1,
      district,
      province,
      postal_code,
    ]);

    return (
      <div key={id} className={className} lat={lat} lng={long} location={id}>
        {active && (
          <div className={s.balloon} title={name}>
            <h4 className={s.name}>{name}</h4>
            <p>{addressLine}</p>
            <div className={s.split}>
              <div className={s.left}>
                <p>
                  <strong>{translate('contact')}</strong>
                </p>
                <p>{telephone}</p>
              </div>
              <div className={s.right}>{/* Operating Hours */}</div>
            </div>
            <div className={s.center}>
              <button
                className={cx(s.btn, { [s.active]: selected })}
                onClick={this.handelSelect(location)}
              >
                {selected ? translate('deselect') : translate('select')}
              </button>
            </div>
          </div>
        )}
        <img className={s.pin} src={`/icons/${icon}`} alt={name} />
      </div>
    );
  };

  onBoundsChange = ({ /*bounds,*/ center, zoom }) => {
    this.props.onCenterChange(center);
    this.props.onZoomChange(zoom);
  };

  onChildClick = (key, childProps) => {
    const id = childProps.location; // as string
    const center = {
      lat: Number(childProps.lat),
      lng: Number(childProps.lng),
    };
    this.props.onCenterChange(center);
    this.props.onActiveIdChange(id);
  };

  /**
   * curry function to create click handler
   */
  handleItemClick = location => () => {
    const { id, lat, long } = location;
    const center = { lat: Number(lat), lng: Number(long) };
    this.props.onCenterChange(center);
    this.props.onActiveIdChange(id);
  };

  handelSelect = location => e => {
    e.preventDefault();
    // toggle selection
    const { id } = location;
    const selected = id !== this.props.selectedId;
    this.props.onSelectedIdChange(selected ? id : null);
    if (this.props.onChange) {
      this.props.onChange(selected ? location : null);
    }
  };
}

export default LocationSelector;
