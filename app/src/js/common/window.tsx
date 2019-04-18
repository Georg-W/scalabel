import React from 'react';
import ReactDOM from 'react-dom';
import LabelLayout from '../components/label_layout';
import TitleBar from '../components/title_bar';
import Session from './session';
import Path from './path';
import MainView from '../components/main_view';
import ImageView from '../components/image_view';
import PointCloudView from '../components/point_cloud_view';

/**
 * Manage the whole window
 */
export class Window {
  private container?: Element;

  /**
   * Window constructor
   * @param {string} containerName: name of the container in HTML to
   * place this window
   */
  constructor(containerName: string) {
    const container = document.getElementById(containerName);
    if (container) {
      this.container = container;
    }
  }

  /**
   * Function to render the interface
   */
  public render() {
    /* LabelLayout props:
         * titleBar: required
         * main: required
         * leftSidebar1: required
         * leftSidebar2: optional
         * bottomBar: optional
         * rightSidebar1: optional
         * rightSidebar2: optional
         */
    const state = Session.getState();

    // get all the components
    const titleBar = (
        <TitleBar
            title={state.config.pageTitle}
            instructionLink={state.config.instructionPage}
            dashboardLink={Path.vendorDashboard()}
        />
    );
    const leftSidebar1 = (<div>1</div>);
    let labelView;
    if (Session.itemType === 'image') {
      labelView = (<ImageView key={'imageView'}/>);
    } else {
      labelView = (<PointCloudView key={'pointCloudView'}/>);
    }
    const main = (<MainView views={[labelView]} />);
    const bottomBar = (<div>3</div>);
    const rightSidebar1 = (<div>4</div>);
    const rightSidebar2 = (<div>5</div>);
    // render the interface
    if (this.container) {
      ReactDOM.render(
        <LabelLayout
          titleBar={titleBar}
          leftSidebar1={leftSidebar1}
          bottomBar={bottomBar}
          main={main}
          rightSidebar1={rightSidebar1}
          rightSidebar2={rightSidebar2}
        />,
        this.container
      );
    }
  }
}

export type WindowType = Window;
