<?php

/**
 *	RedactorJs! plugin
 *
 *	@package Monstra
 *  @subpackage Plugins
 *	@author Imperavi
 *	@copyright 2014 Imperavi
 *	@version 9.2
 *
 */

// Register plugin
Plugin::register( __FILE__,
                __('RedactorJs!', 'RedactorJs'),
                __('RedactorJs! universal markup jQuery editor', 'RedactorJs'),
                '9.2',
                'Imperavi',
                'http://imperavi.com/redactor/');

// Add hooks
Action::add('admin_header', 'RedactorJs::headers');

/**
 * RedactorJs Class
 */
class RedactorJs
{
    /**
     * Set editor headers
     */
    public static function headers()
    {
        echo ('
            <!-- RedactorJs! 9.2 -->
            <script type="text/javascript" src="'.Option::get('siteurl').'/plugins/redactorjs/redactorjs/redactor.min.js"></script>
			<!-- RedactorJs! langs -->
            <script type="text/javascript" src="'.Option::get('siteurl').'/plugins/redactorjs/redactorjs/lang/ru.js"></script>
            <!-- RedactorJs! skin -->
            <link rel="stylesheet" type="text/css" href="'.Option::get('siteurl').'/plugins/redactorjs/redactorjs/redactor.css" />
			<!-- RedactorJs! plugins -->
            <script type="text/javascript" src="'.Option::get('siteurl').'/plugins/redactorjs/redactorjs/plugins/cut/cut.js"></script>
			<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.min.css">
        ');

        echo ('<script>$(function(){$("#editor_area").redactor({lang: "ru", plugins: ["cut"], imageUpload: "/plugins/redactorjs/redactorjs/plugins/uploads/image_upload.php",   fileUpload: "/plugins/redactorjs/redactorjs/plugins/uploads/file_upload.php",imageGetJson: "/public/uploads/img/imageslist.json", paragraphy: false, autoresize: false});});</script>');
    }

}
