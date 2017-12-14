import React, { Component } from 'react';
import { groupBy, filter } from 'lodash';
import { connectStateResults } from 'react-instantsearch/connectors';
import Collapsible from 'react-collapsible';
import { ChevronDown, ChevronUp } from 'react-feather';
import { ShareButtons, generateShareIcon } from 'react-share';

import '../../scss/measure.css';

const { FacebookShareButton, TwitterShareButton } = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

const STATUS_MAP = {
  IN_PROGRESS: 'En vigueur',
  IS_LAW: 'Voté',
  VOTED: 'En cours'
}

const slugify = str => str.toLowerCase().replace(/\s/g, '-');

const ShareMeasure = ({measure}) => {
  if (!measure.socialMediaCopy && false) {
    return null;
  } else {
    return (
      <div className="share-measure">
        <FacebookShareButton url={measure.link} quote={measure.socialMediaCopy}>
          <FacebookIcon round={true} size={40} iconBgStyle={{fill: '#6f81ff'}}/>
        </FacebookShareButton>
        <TwitterShareButton url={measure.link} title={measure.socialMediaCopy}>
          <TwitterIcon round={true} size={40} iconBgStyle={{fill: '#6f81ff'}}/>
        </TwitterShareButton>
      </div>
    );
  }
}

export const Measure = ({measure}) =>
  <a
    href="http://www.wnyc.org"
    target="_blank"
    rel="noreferrer noopener"
    className={`measure ${slugify(STATUS_MAP[measure.status])}`}>
    <div className="measure-body">
      <div className="measure-status">
        {STATUS_MAP[measure.status]}
      </div>
      <div className="measure-name">
        {measure.title}
      </div>
    </div>
    
    <ShareMeasure measure={measure} />
  </a>
  
const Trigger = ({ count, nodeRef }) =>
  <span ref={nodeRef}>
    <ChevronUp className="up" /><ChevronDown className="down" />Plus de mesures ({count})
  </span>

class CollapsibleMeasures extends Component {
  onOpen() {
    this.trigger.parentElement.parentElement.classList.add('to-bottom');
  }
  
  onClose() {
    setTimeout(() => {
      this.trigger.parentElement.parentElement.classList.remove('to-bottom');
    }, 400);
  }

  render() {
    let { measures } = this.props;
    return (
      <Collapsible
       onOpening={this.onOpen.bind(this)}
       onClosing={this.onClose.bind(this)}
       trigger={<Trigger nodeRef={e => this.trigger = e} count={measures.length - 6} />}
       classParentString="measure-accordion"
       triggerClassName="measure-accordion__trigger"
       >
        {measures.slice(6).map((measure, i) => <Measure key={i} measure={measure} />)}
      </Collapsible>
    );
  }
}
  
export const NoMeasure = ({theme}) =>
  <p className="no-measure">Il n&apos;y a pas de réformes specifiques au profil de {theme}. Voir toutes les réformes sur le thème {theme}.</p>

export const Measures = connectStateResults(({ searchState: { query }, props: { measures = [], children }}) => {
  if (!measures.length) {
    return children;
  }
  measures = filter(measures, m => m.title.match(new RegExp(query, 'gi')));
  let grouped = groupBy(measures, 'status');
  measures = (grouped['IN_PROGRESS'] || []).concat(grouped['IS_LAW'] || []).concat(grouped['VOTED'] || []);
  
  return (
    <div className="measure-list">
      {measures.slice(0,5).map((measure, i) => <Measure key={i} measure={measure} />)}
      {measures.length > 6 ? <CollapsibleMeasures measures={measures} /> : null}
    </div>
  )
});
