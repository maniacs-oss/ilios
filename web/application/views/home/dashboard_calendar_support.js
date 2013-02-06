/*
 * DEPENDENCY: YUI lib (at least YAHOO.util and its dependencies)
 * DEPENDENCY: DHTMLX Scheduler
 * DEPENDENCY: scripts/ilios_ui.js
 * DEPENDENCY: scripts/ilios_utilities.js
 */



ilios.namespace('home.calendar');


ilios.home.calendar.offeringTableDataStructure = [];

ilios.home.calendar.currentlySelectedIliosModel = null;

ilios.home.calendar.lastStartDateUsedInAddingEvents = null;
ilios.home.calendar.lastEndDateUsedInAddingEvents = null;
ilios.home.calendar.lastModeUsedInAddingEvents = null;

ilios.home.calendar.insertingCalendarEvents = false;

/*
 * We extend the DataTable functionality here with a new method called requery which allows the
 * 	data table to recache from its data source.
 */
YAHOO.widget.DataTable.prototype.requery = function (newRequest) {
    var dataSource = this.getDataSource();
    var req = null;
    var body = null;
    var className = null;

    if (this.get('dynamicData')) {
        // For dynamic data, newRequest is ignored since the request is built by
        // function generateRequest.
        var paginator = this.get('paginator');

        this.onPaginatorChangeRequest(paginator.getState({ 'page': paginator.getCurrentPage() }));
    } else {
        // The LocalDataSource needs to be treated different
        if (dataSource instanceof YAHOO.util.LocalDataSource) {
            dataSource.liveData = newRequest;
            req = "";
        } else {
            req = ((newRequest === undefined) ? this.get('initialRequest') : newRequest);
        }

        dataSource.sendRequest(req, {
            success: this.onDataReturnInitializeTable,
            failure: this.onDataReturnInitializeTable,
            scope: this,
            argument: this.getState()
        });
    }

    // force relayout due to this requery and table population munging the layout.. :- /
    body = document.getElementsByTagName("body")[0];
    className = body.className;
    body.className = "forceReflow";
    body.className = className;
};

ilios.home.calendar.forceDataTableRefresh = function () {
    if (ilios.home.offeringDataTable != null) {
        ilios.home.offeringDataTable.requery();
    }
};

/**
 * This is called onDOMReady. This sets up the configuration of the DHTMLX scheduler canvas
 * 	including registering for event notifications from that canvas.
 */
ilios.home.calendar.initCalendar = function () {
    var weekColumnFormat = scheduler.date.date_to_str("%M %j, %D");

    scheduler.config.first_hour = 0;
    scheduler.config.last_hour = 24;
    scheduler.config.scroll_hour = 8;

    scheduler.config.start_on_monday = false;
    scheduler.config.time_step = 15;

    scheduler.config.edit_on_create = false;
    scheduler.config.details_on_create = true;
    scheduler.config.details_on_dblclick = true;

    scheduler.config.icons_select = ['icon_dhtmlx_spacer'];
    scheduler._click.buttons.dhtmlx_spacer = function (eventId) { return false; };
    scheduler.config.xml_date = "%Y-%m-%d %H:%i";

    scheduler.config.multi_day = true;

    var today = new Date();

    today.setHours(0,0,0,0);
    scheduler.config.agenda_start = scheduler.date.add(today, -5, "day"); // 5 days prior to current date
    scheduler.config.agenda_end = scheduler.date.add(today, 2, "month"); // 2 month from current date

    scheduler.init('dhtmlx_scheduler_container', new Date(), "week");

    scheduler.templates.event_class = function (start, end, event) {
        var rhett = '';

        // shouldn't ever be non-null but DHMTLX surprises
        if (event.iliosModel != null) {

            if (event.iliosModel.isIndependentLearningEvent()) {
                rhett = 'ilm';
            } else {
                rhett = event.iliosModel.getSessionTypeCssClass() || '';
            }
            if (event.iliosModel.isSelected) {
                rhett += " selected_calendar_event";
            }

            if (event.iliosModel.recentlyUpdated) {
                rhett += " recently_updated_calendar_event";
            }
        }
        return rhett;
    };

    scheduler.templates.week_scale_date = function (date) { return weekColumnFormat(date); };

    ilios.home.calendar.fixDHTMLXDivCSS();


    scheduler.attachEvent("onClick", ilios.home.calendar.calendarEventSelected);
    scheduler.attachEvent("onBeforeDrag",
                          function (eventId, mode, domEventElement) { return false; });
    scheduler.attachEvent("onEventAdded",
                          function (eventId, eventObject) {
                            if (! ilios.home.calendar.insertingCalendarEvents) {
                                scheduler.deleteEvent(eventId);
                            }});
    scheduler.attachEvent("onViewChange", ilios.home.calendar.calendarViewChanged);

    scheduler.showLightbox = function (eventId) { return false; };
};

ilios.home.calendar.calendarEventSelected = function (eventId, domEventElement) {
    var schedulerEvent = scheduler.getEvent(eventId);
    var iliosModel = schedulerEvent.iliosModel;

    if (schedulerEvent.iliosModel.isAggregatePlaceholder) {
        scheduler.setCurrentView(schedulerEvent.iliosModel.getStartDate(), 'day');
        return true;
    }

    if (pageLoadedForStudent || isCalendarView) {
        if (ilios.home.calendar.currentlySelectedIliosModel != null) {
            if (ilios.home.calendar.currentlySelectedIliosModel == iliosModel) {
                ilios.home.calendar.togglePanel('dashboard_inspector_content', true);
                return true;
            }

            ilios.home.calendar.currentlySelectedIliosModel.isSelected = false;
            scheduler.updateEvent(ilios.home.calendar.currentlySelectedIliosModel.calendarEventId);
        }

        ilios.home.calendar.currentlySelectedIliosModel = iliosModel;
        ilios.home.calendar.currentlySelectedIliosModel.isSelected = true;
        ilios.home.calendar.currentlySelectedIliosModel.calendarEventId = eventId;

        if (iliosModel.isIndependentLearningEvent()) {
            ilios.learner_view.loadSILMDetailsIntoDivContainer(iliosModel.getSessionId(),
                document.getElementById(
                'dashboard_inspector_content'),
                true);

        } else {
            ilios.learner_view.loadOfferingDetailsIntoDivContainer(iliosModel.getOfferingId(),
                                           document.getElementById(
                                           'dashboard_inspector_content'),
                                           true);
        }

        if (ilios.home.calendar.lastModeUsedInAddingEvents != 'month') {
            scheduler.updateEvent(eventId);

            // so awfully hacky
            setTimeout('ilios.home.calendar.fixDHTMLXDivCSS()', 100);
        } else {
            // known DHTMLX scheduler bug when laying out custom events in month view; was supposed to
            //      be fixed for 2.1, though we're using 2.2 and it's still gefickt
            //  http://forum.dhtmlx.com/viewtopic.php?f=6&t=3435&p=10223&hilit=updateEvent#p10223
            scheduler.render_view_data();
        }
        ilios.home.calendar.hideSiblingPanels("dashboard_inspector_content");
        YAHOO.util.Dom.get("dashboard_inspector_content").style.display = "";
    } else {
        IEvent.fire({action: 'lv_dialog_open', model: iliosModel});
    }

    return false;
};

/**
 * This method sets the displayed calendar date to either the first day of the course, or the
 * 	first day of all offerings for this session (if this session has offerings); the view mode
 * 	is set as 'week'.
 */
ilios.home.calendar.resetCurrentCalendarViewToStart = function () {
    var dateZero = new Date();

    // per DASHBOARD-1, the desired behaviour is to show the current day as dateZero
    // if (ilios.utilities.arraySize(ilios.home.transaction.loadedOfferingModels) > 0) {
    //     var model = null;
    //
    //     dateZero = new Date(2999, 12, 14);
    //
    //     for (var key in ilios.home.transaction.loadedOfferingModels) {
    //         model = ilios.home.transaction.loadedOfferingModels[key];
    //
    //         if (model.getStartDate() < dateZero) {
    //             dateZero = model.getStartDate();
    //         }
    //     }
    // }

    scheduler.setCurrentView(dateZero, 'week');
};

/*
 * Changes the calendar view to a specified date preserving the present view mode.
 *
 * Should be considered @protected
 */
ilios.home.calendar.focusCalendarOnStartDate = function (startDate) {
    var viewMode = ((ilios.home.calendar.lastModeUsedInAddingEvents != null)
        ? ilios.home.calendar.lastModeUsedInAddingEvents
        : 'week');

    scheduler.setCurrentView(startDate, viewMode);
};

/**
 * Given an offering id for a model in the offering table data structure, change the calendar view
 * 	to focus on that offering's start date.
 */
ilios.home.calendar.focusCalendarOnStartDateOfOfferingWithId = function (offeringId) {
    var newDate = new Date();
    var model = null;

    // TODO optimize datastructure -- consider storing associated to id
    for (var key in ilios.home.calendar.offeringTableDataStructure) {
        model = ilios.home.calendar.offeringTableDataStructure[key];

        if (model.id == offeringId) {
            newDate = new Date(model.date.getTime()); // clone! the date
            break;
        }
    }

    ilios.home.calendar.focusCalendarOnStartDate(newDate);
};

/*
 * For whatever reason DHTMLX miscalculates the height of this div making it overlap what would
 *		be the border of its container
 *
 * Should be considered @protected
 */
ilios.home.calendar.fixDHTMLXDivCSS = function () {
    var Element = YAHOO.util.Element;
    var element = new Element(document.getElementById('dhx_cal_data'));
    var height = element.getStyle('height');
    var split = height.split("p");
    var newHeight = parseInt(split[0]) - 1;
    var allDisplayedCalEvents = element.getElementsByClassName('dhx_cal_event');

    element.setStyle('height', ('' + newHeight + 'px'));

    for (var key in allDisplayedCalEvents) {
        element = new Element(allDisplayedCalEvents[key]);

        height = element.getStyle('height');
        split = height.split("p");
        newHeight = parseInt(split[0]) - 3;

        element.setStyle('height', ('' + newHeight + 'px'));
    }
    };

/**
 * This is messaged via the canvas' onViewChange which notifies us that the user's view of the
 * 	calendar has changed; we take this opportunity to populate the calendar view with just the
 * 	events which are visible in the given time window display (in order to keep the scheduler's
 * 	state store as light as possible)
 *
 * http://docs.dhtmlx.com/doku.php?id=dhtmlxscheduler:event_onviewchange
 */
ilios.home.calendar.calendarViewChanged = function (mode, date) {
    var startDate = date;

    if (mode == 'week') {
        startDate = ilios.home.calendar.getLastSundayForDate(date);
    }
    else if (mode == 'month') {
        startDate = ilios.home.calendar.getFirstOfMonthForDate(date);
    }
    else if (mode == 'agenda') {
        startDate = new Date();
        startDate.setHours(0,0,0,0);
        startDate.setDate(startDate.getDate() - 5);
    }

    ilios.home.calendar.addEventsFromModelToScheduler(startDate, mode);
    ilios.home.calendar.fixDHTMLXDivCSS();
};

/*
 * This method generates the text which is rendered in the visible calendar event.
 *
 * Should be considered @private
 */
ilios.home.calendar.generateEventObjectDisplayTextForModel = function (model) {
    var rhett = '';
    var multipleI18NStr = ilios_i18nVendor.getI18NString('general.terms.multiple');
    var location = model.getLocation();

    if (pageLoadedForStudent && model.shouldDisplayAsTBD()) {
        rhett = ilios_i18nVendor.getI18NString('general.acronyms.to_be_decided');
    } else {
        if (location) {
            rhett += "<strong>" + location + ":</strong> ";
        }
        rhett += model.getSessionTitle();
    }

    if (model.isAggregatePlaceholder) {
        rhett += ", " + multipleI18NStr;
    }

    return rhett;
};

/**
 * Given a start date, view mode, and sessions v. all course offerings, add the appropriate
 * events to the scheduler [in order to keep the internal state of the scheduler at any
 * given moment as light as possible while still rendering the view correctly].
 *
 * @param viewStartDate will be set to have a UTC time of 00:00:00; if null, then the value used
 *     when this method was last used will be reused (as will the
 *     viewMode); since we call a fully populated version of this method
 *     on DOM ready, the state will never be unprepared.
 * @param viewMode one of the three dhtmlx scheduler mode strings: 'day', 'week', 'month'
 */
ilios.home.calendar.addEventsFromModelToScheduler = function (viewStartDate, viewMode) {
    var modelsToAdd = new Array();
    var model = null;
    var viewEndDate = null;
    var i = 0;
    var k = 0;
    var len = 0;
    var startDateToUse = null;

    if (viewStartDate == null) {
        startDateToUse = new Date(ilios.home.calendar.lastStartDateUsedInAddingEvents.getTime());
        viewMode = ilios.home.calendar.lastModeUsedInAddingEvents;
    } else {
        startDateToUse = new Date(viewStartDate.getTime());
    }

    viewEndDate = ilios.home.calendar.getCurrentViewEndDate(startDateToUse, viewMode);

    startDateToUse.setHours(0, 0, 0, 0);

    for (var key in ilios.home.transaction.loadedOfferingModels) {
        model = ilios.home.transaction.loadedOfferingModels[key];

        if ((model.getStartDate() > startDateToUse) && (model.getStartDate() < viewEndDate)) {
            modelsToAdd.push(model);
        }
    }

    modelsToAdd.sort(ilios.home.calendar.offeringModelComparator);

    scheduler.clearAll();

    len = modelsToAdd.length;
    ilios.home.calendar.insertingCalendarEvents = true;

    for (; i < len; i++) {
        model = modelsToAdd[i];

        if (viewMode != 'day') {
            for (k = (i + 1); k < len; k++) {
                nextModel = modelsToAdd[k];

                if (! nextModel.isSchedulerEqual(model)) {
                    break;
                }
            }

            if (i != (k - 1)) {
                nextModel = new CalendarItemModel();
                nextModel.ilmEvent = model.isIndependentLearningEvent();
                nextModel.sessionTypeCssClass = model.getSessionTypeCssClass();
                nextModel.sessionTitle = model.getSessionTitle();
                nextModel.startDate = model.getStartDate();
                nextModel.endDate = model.getEndDate();
                nextModel.sessionId = model.getSessionId();
                nextModel.isAggregatePlaceholder = true;
                i = (k - 1);
            } else {
                nextModel = model;
            }
        } else {
            nextModel = model;
        }


        if (model.getOfferingId() == -1) {
            scheduler.addEvent({
                start_date: model.getStartDate(),
                end_date: model.getEndDate(),
                text: ilios.home.calendar.generateEventObjectDisplayTextForModel(nextModel),
                iliosModel: nextModel
            });
        } else {
            scheduler.addEvent(model.getStartDate(), model.getEndDate(),
                ilios.home.calendar.generateEventObjectDisplayTextForModel(nextModel),
                model.getOfferingId(),
                {
                    iliosModel: nextModel
                });
        }
    }
    ilios.home.calendar.insertingCalendarEvents = false;

    ilios.home.calendar.lastStartDateUsedInAddingEvents = startDateToUse;
    ilios.home.calendar.lastEndDateUsedInAddingEvents = viewEndDate;
    ilios.home.calendar.lastModeUsedInAddingEvents = viewMode;

    ilios.home.calendar.fixDHTMLXDivCSS();
};

/*
 * This function will be passed to Array.sort() when an array instance is homogenous in
 * 	OfferingModel and we want that array sorted for earliest start -> latest start; in the case
 * 	of two OM with the same start, and a secondary comparison is performed to sort the one with the
 * 	earlier end-date as the 'before' element.
 */
ilios.home.calendar.offeringModelComparator = function (om1, om2) {
    var t1 = om1.getStartDate().getTime();
    var t2 = om2.getStartDate().getTime();

    if (t1 != t2) {
        return t1 - t2;
    }

    t1 = om1.getEndDate().getTime();
    t2 = om2.getEndDate().getTime();

    return t1 - t2;
};

/*
 * @return a javascript Date instance for 00:00:00 (local TZ) last Sunday (or the param, if it's Sunday)
 *
 * Should be considered @private
 */
ilios.home.calendar.getLastSundayForDate = function (originalDate) {
    var rhett = new Date();

    rhett.setFullYear(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());

    if (rhett.getDay() != 0) {
        rhett.setDate(rhett.getDate() - rhett.getDay());
    }

    rhett.setHours(0, 0, 0, 0);

    return rhett;
};

/*
 * @return a javascript Date instance for 00:00:00 (local TZ) on the first day of the month of the param
 *
 * Should be considered @private
 */
ilios.home.calendar.getFirstOfMonthForDate = function (originalDate) {
    var rhett = new Date();

    rhett.setFullYear(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate());
    rhett.setDate(1);
    rhett.setHours(0, 0, 0, 0);

    return rhett;
};

/*
 * @param viewStartDate if null, ilios.home.calendar.lastStartDateUsedInAddingEvents
 *     & ilios.home.calendar.lastModeUsedInAddingEvents will be used
 * Should be considered @protected
 */
ilios.home.calendar.getCurrentViewEndDate = function (viewStartDate, viewMode) {
    var rhett = null;

    if (viewStartDate == null) {
        viewStartDate = ilios.home.calendar.lastStartDateUsedInAddingEvents;
        viewMode = ilios.home.calendar.lastModeUsedInAddingEvents;
    }

    rhett = new Date(viewStartDate.getTime());
    rhett.setHours(0, 0, 0, 0);
    if (viewMode == 'week') {
        rhett.setDate(viewStartDate.getDate() + 7);
    } else if (viewMode == 'day') {
        rhett.setDate(viewStartDate.getDate() + 1);
    } else if (viewMode == 'month') {
        rhett.setMonth(viewStartDate.getMonth() + 1);
    } else { // agenda
        var today = new Date();
        today.setHours(0,0,0,0);
        rhett.setMonth(today.getMonth() + 2);
    }
    return rhett;
};

/**
 * A convenience method handed over to the YAHOO data source instance.
 */
ilios.home.calendar.getOfferingSummaryTableData = function () {
    return ilios.home.calendar.offeringTableDataStructure;
};

ilios.home.calendar.hideSiblingPanels = function (panelId) {
    var Dom = YAHOO.util.Dom;
    var panel = Dom.get(panelId);

    if (null == panel) {
        // Can't find panel with panelId
        return false;
    }

    if (null == panel.parentNode) {
        // panel has no parent
        return false;
    }

    return Dom.batch(Dom.getChildren(panel.parentNode), function (el, o) {
        if (el.id != o) {
            el.style.display = 'none';
        }
    }, panelId);
};

ilios.home.calendar.togglePanel = function (panelId, hideOtherPanels) {
    var panel = YAHOO.util.Dom.get(panelId);

    if (null == panel) {
        // Can't find panel with panelId
        return false;
    }

    var curstate = panel.style.display;

    if (('' == curstate) || ('none' == curstate)) {
        if ((typeof hideOtherPanels != 'undefined') && hideOtherPanels) {
            ilios.home.calendar.hideSiblingPanels( panelId );
        }
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
    return true;
};

ilios.home.calendar.selectAllCheckboxes = function (elContainer, checked) {
    var Dom = YAHOO.util.Dom;
    if (typeof checked == "undefined") {
        checked = true;
    }

    if (null != elContainer) {
        return Dom.batch(Dom.getChildren( elContainer ), function (el) {
        if (el.tagName == "INPUT") {
            el.checked = checked;
        }
     });
    }
    return false;
};

ilios.home.calendar.initFilterHooks = function () {
    var Dom = YAHOO.util.Dom;
    var Event = YAHOO.util.Event;
    // Initialize the toggle button for the 'filter'
    var btntoggle = Dom.get('calendar_filters_btn');
    var dialogid = 'calendar_filters_dialog';
    var panelid = "dashboard_calendar_filters_content";
    var panel = Dom.get(panelid);

    if (null != btntoggle) {
        if (null != Dom.get(dialogid)) {
            var panelWidth = "538px";
            var dialog = new YAHOO.widget.Dialog( dialogid, {
                width: panelWidth,
                modal: true,
                visible: false,
                constraintoviewport: false,
                buttons: [
                    {
                        text: "Search",
                        handler: function () {
                            ilios.home.calendar.filtersDialog.submit();
                            ilios.home.calendar.applyCalendarFilters();
                            return false;
                        },
                        isDefault: true
                    },
                    {
                        text: "Cancel",
                        handler: function () {
                            this.cancel();
                        }
                    }
                ]
            });

            dialog.showDialogPane = function() {
                dialog.center();
                dialog.show();
            };

            dialog.render();

            ilios.home.calendar.filtersDialog = dialog;

            Event.addListener( btntoggle, "click", function () {
                ilios.home.calendar.filtersDialog.showDialogPane();
                return false;
            });
        } else {
            Event.addListener( btntoggle, "click", function () {
                ilios.home.calendar.togglePanel( panelid,  true );
                // return false;
            });
        }
    }

    // Initialize the 'search by topic' and 'search by course' toggles
    var togglefunc = function () {
        var Dom = YAHOO.util.Dom;
        var topicpanelid = "search_by_topic_panel";
        var coursepanelid = "search_by_course_panel";

        var topicpanel = Dom.get(topicpanelid);
        var coursepanel = Dom.get(coursepanelid);

        if (topicpanel.style.display == "none") {
            ilios.home.calendar.togglePanel(topicpanelid, true);
            ilios.home.calendar.togglePanel("search_by_course_toggle", true);
        } else {
            ilios.home.calendar.togglePanel(coursepanelid, true);
            ilios.home.calendar.togglePanel("search_by_topic_toggle", true);
        }
        return false;
    };

    var searchbycoursetoggle = Dom.get("search_by_course_toggle");
    var searchbytopictoggle = Dom.get("search_by_topic_toggle");

    if (null != searchbycoursetoggle) {
        Event.addListener(searchbycoursetoggle, "click", togglefunc);
    }

    if (null != searchbytopictoggle) {
        Event.addListener(searchbytopictoggle, "click", togglefunc);
    }

    // Initalize academic year drop box
    var academicyearselect = Dom.get("calendar_filters_academic_year_select");

    if (null != academicyearselect) {
        Event.addListener(academicyearselect, "change", ilios.home.calendar.filtersSelectionChanged);
        var year = academicyearselect.options[academicyearselect.selectedIndex].value;
        ilios.home.calendar.filtersUpdateCourseList(year);
    }

    // Initialize all the 'select all' toggles
    var selectalltoggles = Dom.getElementsByClassName( "select_all_toggle", "A");

    for (var key in selectalltoggles) {
        var toggle = selectalltoggles[key];

        Event.addListener( toggle, "click", function () {
            var Dom = YAHOO.util.Dom;
            ilios.home.calendar.selectAllCheckboxes(Dom.getNextSibling(this.parentNode) );
            var clearalltoggles = Dom.getElementsByClassName("clear_all_toggle", "A", this.parentNode);
            this.style.display = "none";
            clearalltoggles[0].style.display = "";
            return false;
        });
    }

    // Initialize all the 'clear all' toggles
    var clearalltoggles = Dom.getElementsByClassName( "clear_all_toggle", "A");

    for (key in clearalltoggles) {
        var toggle = clearalltoggles[key];

        Event.addListener( toggle, "click", function () {
            var Dom = YAHOO.util.Dom;
            ilios.home.calendar.selectAllCheckboxes(Dom.getNextSibling(this.parentNode), false );
            var selectalltoggles = Dom.getElementsByClassName( "select_all_toggle", "A", this.parentNode );
            this.style.display = "none";
            selectalltoggles[0].style.display = "";

            return false;
        });
    }

    // Initialize 'Search' button
    var searchbutton = Dom.get("calendar_filters_search_button");

    if (null != searchbutton) {
        if (null != ilios.home.calendar.filtersDialog) {
            Event.addListener( searchbutton, "click", function () {
                ilios.home.calendar.filtersDialog.submit();
                ilios.home.calendar.applyCalendarFilters();
                return false;
            });
        } else {
            Event.addListener( searchbutton, "click", function () {
                ilios.home.calendar.applyCalendarFilters();
                return false;
            });
        }
    }

    // Initialize 'Clear' button
    var clearbutton = Dom.get("calendar_filters_clear_button");

    if (null != clearbutton) {
        if (null != ilios.home.calendar.filtersDialog) {
            Event.addListener( clearbutton, "click", function () {
                ilios.home.calendar.filtersDialog.cancel();
                ilios.home.calendar.clearCalendarFilters();
                return false;
            });
        } else {
            Event.addListener( clearbutton, "click", function () {
                ilios.home.calendar.togglePanel( panelid,  true );
                ilios.home.calendar.clearCalendarFilters();
                return false;
            });
        }
    }

    var clearlink = Dom.get("calendar_filters_clear_search_link");

    if (null != clearlink) {
        Event.addListener( clearlink, "click", function () {
            ilios.home.calendar.clearCalendarFilters();
            return false;
        });
    }
};

ilios.home.calendar.filtersSelectionChanged = function (e) {
    if ('calendar_filters_academic_year_select' == e.target.id) {
        ilios.home.calendar.filtersUpdateCourseList(e.target.options[e.target.selectedIndex].value);
    }
};

ilios.home.calendar.filtersUpdateCourseList = function (year) {
    var url = controllerURL + "getCourseListForAcademicYear";
    var method = "POST";
    var paramString = "year=" + year + "&sort=title";
    var ajaxCallback = {
    success: function(resultObject) {
        var Dom = YAHOO.util.Dom;
        var parsedObject = null;
        var courseModel = null;
        var resultsContainer = null;
        var element = null;
        var elementlabel = null;
        try {
            parsedObject = YAHOO.lang.JSON.parse(resultObject.responseText);
        } catch (e) {
        document.getElementById('calendar_filters_course_list').innerHTML
            = ilios_i18nVendor.getI18NString('general.error.must_retry');
            return;
        }

        resultsContainer = document.getElementById('calendar_filters_course_list');
        ilios.utilities.removeAllChildren(resultsContainer);

        for (var key in parsedObject) {
            courseModel = new CourseModel(parsedObject[key]);
            var checkboxid = "checkbox-" + courseModel.getTitle() + "-" + courseModel.getDBId();
            element = document.createElement('input');
            element.setAttribute('type', 'checkbox');
            element.setAttribute('value', courseModel.getDBId());
            element.setAttribute('id', checkboxid);

            elementlabel = document.createElement('label');
            elementlabel.setAttribute('for', checkboxid);
            elementlabel.innerHTML = courseModel.getTitle() + ' '
                + courseModel.getExternalCourseId() + ' '
                + '<span style="font-size: 8pt; color: #808080;">('
                + courseModel.getStartDateAsDateObject().format('m/d/yyyy')
                + ' - '
                + courseModel.getEndDateAsDateObject().format('m/d/yyyy')
                + ')</span><br />';
            resultsContainer.appendChild(element);
            resultsContainer.appendChild(elementlabel);
        }

        var selectalltoggles = Dom.getElementsByClassName("select_all_toggle", "A", resultsContainer.parentNode);
        selectalltoggles[0].style.display = "";
        var clearalltoggles = Dom.getElementsByClassName("clear_all_toggle", "A", resultsContainer.parentNode);
        clearalltoggles[0].style.display = "none";

    },
    failure: function(resultObject) {
        ilios.global.defaultAJAXFailureHandler(resultObject);
        document.getElementById('calendar_filters_course_list').innerHTML
            = ilios_i18nVendor.getI18NString('general.error.must_retry');
        return;
    }};
    YAHOO.util.Connect.asyncRequest(method, url, ajaxCallback, paramString);
};

ilios.home.calendar.applyCalendarFilters = function () {
    var Dom = YAHOO.util.Dom;

    // Get selected academic year
    var selectbox = Dom.get("calendar_filters_academic_year_select");
    var academicyear = Dom.getAttribute(selectbox.options[selectbox.selectedIndex], 'value');

    // Get show all activities selection boolean
    var showallactivities = Dom.get("calendar_filters_showallactivities").checked;
    var filters = {};
    var getcheckboxesvalues = function ( containerid ) {
    var checkeditems = Dom.getElementsBy( function (el) {
        return el.checked;
    }, "input", Dom.get(containerid));
    var values = new Array();
    for (var i in checkeditems) {
        values.push(checkeditems[i].value);
    }
    return values;
    };

    filters.academicYear = academicyear;

    // If search_by_topic_panel is visible, then update calendar with selected options.
    if (Dom.get("search_by_topic_panel").style.display != 'none') {
        filters.disciplineIds = getcheckboxesvalues("calendar_filters_topic_list");
        filters.sessionTypeIds = getcheckboxesvalues("calendar_filters_topic_session_type_list");
        filters.courseLevels = getcheckboxesvalues("calendar_filters_course_level_list");
        filters.programCohortIds = getcheckboxesvalues("calendar_filters_program_cohort_list");
    }

    // If search_by_topic_panel is visible, then update calendar with selected options.
    if (Dom.get("search_by_course_panel").style.display != 'none') {
        filters.courseIds = getcheckboxesvalues("calendar_filters_course_list");
        filters.sessionTypeIds = getcheckboxesvalues("calendar_filters_course_session_type_list");
    }

    filters.showAllActivities = showallactivities;

    ilios.home.transaction.loadAllOfferings(filters);

    var clearFiltersLink = Dom.get("calendar_filters_clear_search_link");

    if (null != clearFiltersLink) {
        clearFiltersLink.style.display = 'inline';
    }

    var getcheckboxestitles = function ( containerid ) {
        var Dom =YAHOO.util.Dom;
        var checkeditems = Dom.getElementsBy( function (el) {
            return el.checked;
        }, "input", Dom.get(containerid));
        var values = "";
        for (var i in checkeditems) {
            var olabel = Dom.getNextSiblingBy(checkeditems[i], function(el) {
                return el.htmlFor == checkeditems[i].id;
            });
            if (typeof olabel != 'undefined') {
                if (values.length > 0) {
                    values += ", ";
                }
            values += olabel.textContent;
            }
        }
        return values;
    };

    var breadcrumb = Dom.get("calendar_filters_breadcrumb_block");

    if (null != breadcrumb) {
        var bccontent = Dom.get("calendar_filters_breadcrumb_content");
        var bcstring = filters.academicYear + "-" + (parseInt(filters.academicYear) + 1);

        if (typeof filters.disciplineIds != 'undefined' && filters.disciplineIds.length > 0) {
            bcstring += " &gt; " + getcheckboxestitles("calendar_filters_topic_list");
        }
        if (typeof filters.courseIds != 'undefined' && filters.courseIds.length > 0) {
            bcstring += " &gt; " + getcheckboxestitles("calendar_filters_course_list");
        }
        if (typeof filters.sessionTypeIds != 'undefined' && filters.sessionTypeIds.length > 0) {
            if (Dom.get("search_by_topic_panel").style.display != 'none') {
                bcstring += " &gt; " + getcheckboxestitles("calendar_filters_topic_session_type_list");
            }
            if (Dom.get("search_by_course_panel").style.display != 'none') {
                bcstring += " &gt; " + getcheckboxestitles("calendar_filters_course_session_type_list");
            }
        }
        if (typeof filters.courseLevels != 'undefined' && filters.courseLevels.length > 0) {
            bcstring += " &gt; " + getcheckboxestitles("calendar_filters_course_level_list");
        }
        if (typeof filters.programCohortIds != 'undefined' && filters.programCohortIds.length > 0) {
            bcstring += " &gt; " + getcheckboxestitles("calendar_filters_program_cohort_list");
        }

        bccontent.innerHTML = bcstring;
        breadcrumb.style.display = 'inline-block';
    }
};

ilios.home.calendar.clearCalendarFilters = function () {
    var Dom = YAHOO.util.Dom;
    var panel = Dom.get('search_by_topic_panel');

    if (null != panel) {
        if (panel.style.display == "none") {
            ilios.home.calendar.togglePanel(panel, true);
            ilios.home.calendar.togglePanel("search_by_course_toggle", true);
        }
    }

    var selectbox = Dom.get("calendar_filters_academic_year_select");
    // this is the index of the current year, unless we change the range of this select box.
    if (null != selectbox) {
        selectbox.selectedIndex = 5;
        var year = selectbox.options[selectbox.selectedIndex].value;
        ilios.home.calendar.filtersUpdateCourseList(year);
    }

    // Clear all checkboxes
    ilios.home.calendar.selectAllCheckboxes(Dom.get("calendar_filters_topic_list"), false );
    ilios.home.calendar.selectAllCheckboxes(Dom.get("calendar_filters_topic_session_type_list"), false );
    ilios.home.calendar.selectAllCheckboxes(Dom.get("calendar_filters_course_level_list"), false );
    ilios.home.calendar.selectAllCheckboxes(Dom.get("calendar_filters_program_cohort_list"), false );
    ilios.home.calendar.selectAllCheckboxes(Dom.get("calendar_filters_course_list"), false );
    ilios.home.calendar.selectAllCheckboxes(Dom.get("calendar_filters_course_session_type_list"), false );

    // Reset Clear All toggles to Select All
    var toggles = Dom.getElementsByClassName("clear_all_toggle", "A");
    for (var key in toggles) {
        var toggle = toggles[key];
        toggle.style.display = "none";
    }
    toggles = Dom.getElementsByClassName("select_all_toggle", "A");
    for (key in toggles) {
        var toggle = toggles[key];
        toggle.style.display = "";
    }

    var radiobutton = Dom.get("calendar_filters_showallactivities");
    if (null != radiobutton) {
        radiobutton.checked = true;
        ilios.ui.radioButtonSelected(radiobutton);
    }

    var clearlink = Dom.get("calendar_filters_clear_search_link");

    if (null != clearlink) {
        clearlink.style.display = "none";
        var breadcrumb = Dom.get("calendar_filters_breadcrumb_block");

        if (null != breadcrumb) {
            breadcrumb.style.display = 'none';
        }
    }

    ilios.home.transaction.loadAllOfferings();
};