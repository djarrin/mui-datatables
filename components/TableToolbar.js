import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Popover from './Popover';
import TableFilter from './TableFilter';
import TableViewCol from './TableViewCol';
import TableSearch from './TableSearch';
import SearchIcon from '@material-ui/icons/Search';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import PrintIcon from '@material-ui/icons/Print';
import FilterIcon from '@material-ui/icons/FilterList';
import ReactToPrint from 'react-to-print';
import { withStyles } from '@material-ui/core/styles';
import { createCSVDownload } from '../utils';

export const defaultToolbarStyles = theme => ({
  root: {},
  left: {
    flex: '1 1 auto',
  },
  actions: {
    flex: '1 1 auto',
    textAlign: 'right',
  },
  titleRoot: {},
  titleText: {},
  icon: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  iconActive: {
    color: theme.palette.primary.main,
  },
  filterPaper: {
    maxWidth: '50%',
  },
  searchIcon: {
    display: 'inline-flex',
    marginTop: '10px',
    marginRight: '8px',
  },
  [theme.breakpoints.down('sm')]: {
    titleRoot: {},
    titleText: {
      fontSize: '16px',
    },
    spacer: {
      display: 'none',
    },
    left: {
      // flex: "1 1 40%",
      padding: '8px 0px',
    },
    actions: {
      // flex: "1 1 60%",
      textAlign: 'right',
    },
  },
  [theme.breakpoints.down('xs')]: {
    root: {
      display: 'block',
    },
    left: {
      padding: '8px 0px 0px 0px',
    },
    titleText: {
      textAlign: 'center',
    },
    actions: {
      textAlign: 'center',
    },
  },
  '@media screen and (max-width: 480px)': {},
});

class TableToolbar extends React.Component {
  state = {
    iconActive: null,
    showSearch: Boolean(this.props.searchText || this.props.options.searchText),
    searchText: this.props.searchText || null,
  };

  componentDidUpdate(prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      this.setState({ searchText: this.props.searchText });
    }
  }

  setActiveIcon = iconName => {
    this.setState(() => ({
      showSearch: this.isSearchShown(iconName),
      iconActive: iconName,
    }));
  };

  isSearchShown = iconName => {
    let nextVal = false;
    if (this.state.showSearch) {
      if (this.state.searchText) {
        nextVal = true;
      } else {
        const { onSearchClose } = this.props.options;
        if (onSearchClose) onSearchClose();
        nextVal = false;
      }
    } else if (iconName === 'search') {
      nextVal = this.showSearch();
    }
    return nextVal;
  };

  showSearch = () => {
    !!this.props.options.onSearchOpen && this.props.options.onSearchOpen();
    this.props.setTableAction('onSearchOpen');
    return true;
  };

  hideSearch = () => {
    const { onSearchClose } = this.props.options;

    if (onSearchClose) onSearchClose();
    this.props.searchTextUpdate(null);

    this.setState(() => ({
      iconActive: null,
      showSearch: false,
      searchText: null,
    }));
  };

  handleSearch = value => {
    this.setState({ searchText: value });
    this.props.searchTextUpdate(value);
  };

  render() {
    const {
      data,
      options,
      classes,
      columns,
      toggleViewColumn,
    } = this.props;

    const { viewColumns } = options.textLabels.toolbar;
    const {search} = options
    const { searchText } = this.state;

    return (
      <Toolbar className={classes.root + ''} role={'toolbar'} aria-label={'Table Toolbar'}>
        <div className={'row'} style={{width: '100%'}}>
          <div className={classes.left + ' left-container col-md-6 col-12'}>
            <div className={'row'}>
              <div className={'col-12 col-md-4'}>
                {options.viewColumns && (
                    <Popover
                        refExit={this.setActiveIcon.bind(null)}
                        trigger={
                          <Tooltip title={viewColumns} disableFocusListener>
                            <button
                                className={'usa-button tool-bar-button columns'}
                                onClick={this.setActiveIcon.bind(null, 'viewcolumns')}
                            >
                              <i className="far fa-eye"></i>
                              Columns
                              <i className="fas fa-caret-down"></i>
                            </button>
                          </Tooltip>
                        }
                        content={
                          <TableViewCol data={data} columns={columns} options={options} onColumnUpdate={toggleViewColumn} />
                        }
                    />
                )}
              </div>
              <div className={'col-12 col-md-7'}>
                {search ?
                    <TableSearch
                        searchText={searchText}
                        onSearch={this.handleSearch}
                        onHide={this.hideSearch}
                        options={options}
                    />:null
                }

              </div>
            </div>
          </div>
          <div className={'center-container align-items-center col-md-5 col-12'}>
            {options.customToolbar && options.customToolbar()}
          </div>
          <div className={'col-1'}></div>

        </div>
      </Toolbar>
    );
  }
}

export default withStyles(defaultToolbarStyles, { name: 'MUIDataTableToolbar' })(TableToolbar);
