import React from 'react';
import { bpanelClient } from '@bpanel/bpanel-utils';
import { Text, Input } from '@bpanel/bpanel-ui';
import Golomb from 'golomb';
import { Address, util } from 'bcoin';

export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hash: '',
      filterHash: '',
      filter: {},
      data: '',
      match: false
    };
    this.client = bpanelClient();
  }

  static get displayName() {
    return 'Filters Form';
  }

  onChange(e) {
    e.preventDefault();
    this.setState({ hash: e.target.value });
    if (e.target.value.length !== 64) {
      e.target.setCustomValidity(
        'Not valid block hash. Must be 256 bits (64 chars)'
      );
    }
  }

  onTXData(e) {
    const { filter, hash } = this.state;
    e.preventDefault();
    if (filter && hash) {
      const address = Address.fromString(e.target.value);
      const key = util.revHash(hash);
      const match = filter.match(key, address.getHash());
      this.setState({ match });
    } else {
      alert('Need a filter and a block hash first');
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    const { hash } = this.state;
    const filterHash = await this.client.execute('getcfilter', [hash, 0]);
    const filter = Golomb.fromRaw(Buffer.from(filterHash, 'hex'));
    this.setState({ filterHash, filter });
  }

  render() {
    const { hash, filterHash, match } = this.state;

    return (
      <div>
        <form onSubmit={e => this.onSubmit(e)}>
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              value={hash}
              placeholder="Block Hash"
              onChange={e => this.onChange(e)}
              required
              minLength="64"
              maxLength="64"
            />
            <Input type="submit" name="submit" className="form-control" />
          </div>
        </form>
        {filterHash && <Text>Filter: {filterHash}</Text>}
        {filterHash && (
          <div className="col">
            <Input
              type="text"
              name=""
              onChange={e => this.onTXData(e)}
              placeholder="Address to check"
            />
            <Text type="p">Matches data in the block: {match}</Text>
          </div>
        )}
      </div>
    );
  }
}
