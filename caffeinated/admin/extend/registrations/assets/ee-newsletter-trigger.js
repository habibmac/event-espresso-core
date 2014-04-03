jQuery(document).ready(function($) {

    var EENewsletterTrigger = {

        //used to hold whatever the selected MTP is in the selector.
        selectedMTP: 0,
        formContent: '',

        /**
         * this retrieves the form from the page if not already cached in the internal var
         * @return {string}  form html
         */
        getForm: function() {
            if ( this.formContent === '' ) {
                this.formContent = $('#ee-batch-message-send-form').html();
                $('#ee-batch-message-send-form').html('');
            }
            //make sure all formContent is empty.
            return this.formContent;
        },


        /**
         * displays the content retrieved from ajax
         * @param  {string} content the content to display
         * @param  {string} what    what to do with existing content in the target container ('clear', 'append', 'prepend')
         * @param {string} type content or notices ('content', 'notices') : default = content;
         * @return {void}
         */
        display_content: function(content, what ) {
            if ( typeof(what) === 'undefined' ) what = 'clear';

            //if content is empty let's get out
            if ( ( content === '' || typeof(content) === 'undefined' ) )
                return;

            var content_div = $('.ee-notices', '.ee-batch-message-send-form');

            $('#espresso-ajax-loading').eeRemoveOverlay().hide();
            if ( what == 'clear' ) {
                content_div.html('');
                content_div.html(content);
            } else if ( what == 'append' ) {
                content_div.append(content);
            } else if ( what == 'prepend' ) {
                content_div.prepend(content);
            }
        },



        /**
         * this displays the form in an ee-dialog.
         * @return void
         */
         displayForm: function() {
            var selected = [];
            //let's get all selected regs/contacts.
            $('the-list input[type=checkbox]').each( function(i) {
                if ( $(this).prop("checked") )
                    selected[i] = $(this).val();
            });

            //get the form
            var content = this.getForm();
            var dialog = dialogHelper.displayModal(true).addContent(content);
            $('.ee-admin-dialog-container').eeScrollTo(400);
         },



         /**
          * This resets form inputs, closes ee-dialog.
          * @return {void}
          */
         closeForm: function() {
           this.resetFormInputs();
            $('.batch-message-edit-fields').hide();
            dialogHelper.closeModal();
         },



         /**
          * all this does is reset the form inputs
          * @return {void}
          */
         resetFormInputs: function() {
             $(input, '.batch-message-edit-fields').each( function() {
                $(this).val('');
            });

            $(textarea, '.batch-message-edit-fields').val('');
         },


         /**
          * updates the form inputs to be filled with data from the selected mtp.
          * @param  {int} selected_mtp the id for the selected mtp
          * @return {void}
          */
         updateForm: function( selected_mtp ) {
            //if the selected_mtp is 0 then let's just reset the form inputs and hide the form
            if ( typeof( selected_mtp) === 'undefined' || selected_mtp == 0 ) {
                this.resetFormInputs();
                $('.batch-message-edit-fields').hide();
                return;
            }

            //we have a selected_mtp so let's query and get the data for the form.
            this.doAjax(selected_mtp);
         },




         /**
          * This populates the form with the incoming response from ajax
          * @param  {object} response
          * @return {void}
          */
         populateForm:function( response ) {
            $('#espresso-ajax-loading').eeRemoveOverlay().hide();
            //so we need to go through the response and update the related inputs.
            $('#batch-message-from').val(response.batch_message_from);
            $('#batch-message-subject').val(response.batch_message_subject);
            $('#batch-message-content').val(response.batch_message_content);
         },



         /**
          * does the ajax to update the form inputs from the given selected_mtp id
          *
          * @since 4.4.0
          *
          * @param  {int}       selected_mtp id for the message template selected.
          * @return {void}
          */
         doAjax: function( selected_mtp ) {
                $('#espresso-ajax-loading').eeCenter().eeAddOverlay().show();
                var data = {
                    'action' : 'get_newsletter_form_content',
                    'get_newsletter_form_content_nonce' : $('#get_newsletter_form_content_nonce').val(),
                    'selected_mtp' : selected_mtp
                };
                //do post
            $.ajax({
                type: "POST",
                url: ajaxurl,
                data: data,
                success: function(response, status, xhr) {
                    var ct = xhr.getResponseHeader("content-type") || "";
                    var resp = '', isjson = true;
                    if (ct.indexOf('html') > -1) {
                        /*console.log('html');
                        console.log('response');/**/
                        //last verification that we definitely DON'T have JSON (possibly via exceptions)
                        try {
                            resp = $.parseJSON(response);
                        } catch (e) {
                            EENewsletterTrigger.display_content(response, 'clear');
                            isjson = false;
                        }

                    }

                    if ( ct.indexOf('json') > -1 || isjson ) {
                        /*console.log('json');
                        console.log(response);/**/

                        resp = resp === '' ? response : resp;

                        if ( resp.error ) {
                            EENewsletterTrigger.display_content(resp.what, 'clear');
                        } else {
                            EENewsletterTrigger.populateForm(resp.data);
                        }
                        if ( resp.data.close ) {
                            $('#espresso-ajax-loading').eeRemoveOverlay().hide();
                            EENewsletterTrigger.closeForm();
                        }
                    }
                }
            });
            return false;
         }

    };

});
