import { Component } from 'react'
import { Button, Collection, CollectionItem, ProgressBar, Badge } from 'react-materialize'
import { connect } from 'node-realtime-db-react'
import { SITE_LIST_KEY } from '../sitelist/define'
import { getOptions, actions } from '../../cmds'
import Images from './Images'
import Urls from './Urls'

class Track extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      urlsShow: false,
      settingsShow: false,
    }
  }

  render() {
    const { site, io, index, set } = this.props
    const { loading, urlsShow, settingsShow } = this.state
    if (!site) {
      return (<h1>site not found !</h1>)
    }

    const { url, urls = [], logs = [] } = site

    return (<div>
      <h1>{url}</h1>
      {!loading && <div>
        {getOptions(site).map((opt, i) => {
          const { title, click } = actions[opt]
          return (<Button
            onClick={() => click({
              set,
              index,
              io,
              comp: this,
              url,
              site,
            })}
            key={i}
            style={{ marginRight: '15px' }}
          >{title}</Button>)
        })}
        {!!urls.length && <Button onClick={() => this.setState({ urlsShow: !urlsShow })}>Manage Urls</Button>}
      </div>}
      {loading && <ProgressBar />}
      {urlsShow && <Urls site={site} urls={urls} set={set} dataPath={`${SITE_LIST_KEY}.${index}.urls`} />}
      {!loading && <Images baseUrl={url} urls={urls} />}
      <Collection header='logs'>
        {logs.map((val, i) => {
          const str = JSON.stringify(val.data)
          return (<CollectionItem key={i}>
            <Badge>{val.date}</Badge>
            <span>{str}</span>
          </CollectionItem>)
        })}
      </Collection>
    </div>)
  }
}

export default (index) => {
  return connect({ site: `${SITE_LIST_KEY}.${index}` })(Track)
}