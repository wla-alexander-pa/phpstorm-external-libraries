/**
 * Makes sure we have all the required levels on the Tribe Object
 *
 * @since 4.9.4
 *
 * @type   {PlainObject}
 */
tribe.events = tribe.events || {};
tribe.events.views = tribe.events.views || {};

/**
 * Configures Month Mobile Events Object in the Global Tribe variable
 *
 * @since 4.9.4
 *
 * @type   {PlainObject}
 */
tribe.events.views.monthMobileEvents = {};

/**
 * Initializes in a Strict env the code that manages the Event Views
 *
 * @since 4.9.4
 *
 * @param  {PlainObject} $   jQuery
 * @param  {PlainObject} obj tribe.events.views.manager
 *
 * @return {void}
 */
( function( $, obj ) {
	'use strict';
	var $document = $( document );

	/**
	 * Selectors used for configuration and setup
	 *
	 * @since 4.9.8
	 *
	 * @type {PlainObject}
	 */
	obj.selectors = {
		calendar: '[data-js="tribe-events-month-grid"]',
		calendarDay: '[data-js="tribe-events-calendar-month-day-cell-mobile"]',
		calendarDaySelectedClass: '.tribe-events-calendar-month__day-cell--selected',
		mobileEvents: '[data-js="tribe-events-pro-week-mobile-events"]',
		mobileEventsMobileDayShowClass: '.tribe-events-calendar-month-mobile-events__mobile-day--show',
	};

	/**
	 * Closes all mobile events
	 *
	 * @since 4.9.4
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.closeAllEvents = function( $container ) {
		$container.find( obj.selectors.calendarDay ).each( function( index, header ) {
			var $header = $( header );
			var contentId = $header.attr( 'aria-controls' );

			/**
			 * Define empty jQuery object in the case contentId is false or undefined
			 * so that we don't get selectors like #false or #undefined.
			 * Also only perform accordion actions if header has aria-controls attribute.
			 */
			var $content = $( '' );
			if ( contentId ) {
				$content = $container.find( '#' + contentId );
				tribe.events.views.accordion.closeAccordion( $header, $content );
			}

			obj.closeMobileEvents( $header, $content );
		} );
	};

	/**
	 * Opens mobile events
	 *
	 * @since 4.9.8
	 *
	 * @param {jQuery} $header jQuery object of mobile day button
	 * @param {jQuery} $content jQuery object of mobile events container
	 *
	 * @return {void}
	 */
	obj.openMobileEvents = function( $header, $content ) {
		// only perform accordion actions if $header has aria-controls attribute.
		var contentId = $header.attr( 'aria-controls' );
		if ( contentId ) {
			tribe.events.views.accordion.openAccordion( $header, $content );
		}

		$header.addClass( obj.selectors.calendarDaySelectedClass.className() );
		$content.addClass( obj.selectors.mobileEventsMobileDayShowClass.className() );
	};

	/**
	 * Closes mobile events
	 *
	 * @since 4.9.8
	 *
	 * @param {jQuery} $header jQuery object of mobile day button
	 * @param {jQuery} $content jQuery object of mobile events container
	 *
	 * @return {void}
	 */
	obj.closeMobileEvents = function( $header, $content ) {
		// only perform accordion actions if $header has aria-controls attribute.
		var contentId = $header.attr( 'aria-controls' );
		if ( contentId ) {
			tribe.events.views.accordion.closeAccordion( $header, $content );
		}

		$header.removeClass( obj.selectors.calendarDaySelectedClass.className() );
		$content.removeClass( obj.selectors.mobileEventsMobileDayShowClass.className() );
	};

	/**
	 * Toggles mobile events on mobile day click
	 *
	 * @since 4.9.4
	 *
	 * @param {Event} event event object of click event
	 *
	 * @return {void}
	 */
	obj.toggleMobileEvents = function( event ) {
		var $container = event.data.container;
		var $header = $( event.data.target );
		var contentId = $header.attr( 'aria-controls' );

		/**
		 * Define empty jQuery object in the case contentId is false or undefined
		 * so that we don't get selectors like #false or #undefined.
		 */
		var $content = $( '' );
		if ( contentId ) {
			$content = $container.find( '#' + contentId );
		}

		if ( $header.hasClass( obj.selectors.calendarDaySelectedClass.className() ) ) {
			obj.closeMobileEvents( $header, $content );
		} else {
			obj.closeAllEvents( $container );
			obj.openMobileEvents( $header, $content );
		}
	};

	/**
	 * Unbinds events for calendar
	 *
	 * @since 4.9.4
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.unbindCalendarEvents = function( $container ) {
		var $calendar = $container.find( obj.selectors.calendar );
		$calendar
			.find( obj.selectors.calendarDay )
			.each( function( index, day ) {
				$( day ).off( 'click', obj.toggleMobileEvents );
			} );
	};

	/**
	 * Binds events for calendar
	 *
	 * @since 4.9.5
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.bindCalendarEvents = function( $container ) {
		var $calendar = $container.find( obj.selectors.calendar );
		$calendar
			.find( obj.selectors.calendarDay )
			.each( function( index, day ) {
				$( day ).on( 'click', {
					target: day,
					container: $container,
					calendar: $calendar,
				}, obj.toggleMobileEvents );
			} );
	};

	/**
	 * Initializes mobile events state
	 *
	 * @since 4.9.8
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.initState = function( $container ) {
		var $mobileEvents = $container.find( obj.selectors.mobileEvents );
		var state = {
			desktopInitialized: ! tribe.events.views.viewport.state.isMobile,
		};

		$mobileEvents.data( 'tribeEventsState', state );
	};

	/**
	 * Handles resize event
	 *
	 * @since 4.9.8
	 *
	 * @param {Event} event event object for 'beforeAjaxSuccess.tribeEvents' event
	 *
	 * @return {void}
	 */
	obj.handleResize = function( event ) {
		var $mobileEvents = event.data.container.find( obj.selectors.mobileEvents );
		var state = $mobileEvents.data( 'tribeEventsState' );

		if ( ! tribe.events.views.viewport.state.isMobile && ! state.desktopInitialized ) {
			obj.closeAllEvents( event.data.container );
			state.desktopInitialized = true;
		} else if ( tribe.events.views.viewport.state.isMobile && state.desktopInitialized ) {
			state.desktopInitialized = false;
		}

		$mobileEvents.data( 'tribeEventsState', state );
	};

	/**
	 * Deinitializes mobile days
	 *
	 * @since 4.9.8
	 *
	 * @param  {Event}       event    event object for 'beforeAjaxSuccess.tribeEvents' event
	 * @param  {jqXHR}       jqXHR    Request object
	 * @param  {PlainObject} settings Settings that this request was made with
	 *
	 * @return {void}
	 */
	obj.deinit = function( event, jqXHR, settings ) {
		var $container = event.data.container;
		obj.unbindCalendarEvents( $container );
		$document.off( 'resize.tribeEvents', obj.handleResize );
	};

	/**
	 * Initializes mobile days
	 *
	 * @since 4.9.8
	 *
	 * @param  {Event}   event      event object for 'afterSetup.tribeEvents' event
	 * @param  {integer} index      jQuery.each index param from 'afterSetup.tribeEvents' event
	 * @param  {jQuery}  $container jQuery object of view container
	 * @param  {object}  data       data object passed from 'afterSetup.tribeEvents' event
	 *
	 * @return {void}
	 */
	obj.init = function( event, index, $container, data ) {
		var $mobileEvents = $container.find( obj.selectors.mobileEvents );

		if ( ! $mobileEvents.length ) return;

		obj.initState( $container );
		obj.bindCalendarEvents( $container );
		$document.on( 'resize.tribeEvents', { container: $container }, obj.handleResize );
		$container.on( 'beforeAjaxSuccess.tribeEvents', { container: $container }, obj.deinit );
	};

	/**
	 * Handles the initialization of the mobile days when Document is ready
	 *
	 * @since 4.9.4
	 *
	 * @return {void}
	 */
	obj.ready = function() {
		$document.on( 'afterSetup.tribeEvents', tribe.events.views.manager.selectors.container, obj.init );
	};

	// Configure on document ready
	$document.ready( obj.ready );
} )( jQuery, tribe.events.views.monthMobileEvents );
