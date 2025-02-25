# Talking Objects UI Test Checklist

## General UI Tests

- [ ] Verify that all pages load without errors
- [ ] Check that navigation between pages works correctly
- [ ] Test responsive design on different screen sizes
- [ ] Verify that the header and footer are consistent across pages
- [ ] Ensure that loading states are shown appropriately
- [ ] Verify that error messages are displayed when appropriate
- [ ] Check that all buttons and links are functioning

## Authentication UI Tests

- [ ] Verify login form validation works correctly
- [ ] Test password reset functionality
- [ ] Verify sign-up form validation
- [ ] Test email verification process (if applicable)
- [ ] Verify that authenticated users see the profile button
- [ ] Test logout functionality

## Dashboard UI Tests

- [ ] Verify that the dashboard loads correctly
- [ ] Check that agent cards display all required information
- [ ] Test the "Create Agent" button navigates to the creation form
- [ ] Verify that the "Edit" button works for each agent
- [ ] Test the "View" button for each agent
- [ ] Verify that agent deletion confirmation works
- [ ] Check pagination if there are many agents

## Agent Creation/Edit Form UI Tests

- [ ] Verify all form fields are present and labeled correctly
- [ ] Test form validation for required fields
- [ ] Check that the "Save" button works correctly
- [ ] Verify that the "Cancel" button returns to the dashboard
- [ ] Test toggle switches for data sources
- [ ] Verify location field shows suggestions when typing
- [ ] Test image upload functionality

## Agent View Page UI Tests

- [ ] Verify agent information is displayed correctly
- [ ] Check that the chat interface loads
- [ ] Test sending messages and verify responses
- [ ] Verify that the chat scrolls automatically
- [ ] Test "Copy Link" functionality
- [ ] Verify QR code is displayed correctly
- [ ] Test "Download QR" functionality

## Explore Page UI Tests

- [ ] Verify that the explore page loads with public agents
- [ ] Check that agent cards display correctly
- [ ] Test filtering options if available
- [ ] Verify that the "Chat with [agent name]" button works
- [ ] Test pagination if there are many agents

## Accessibility Tests

- [ ] Verify that all images have alt text
- [ ] Check keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify sufficient color contrast
- [ ] Check that form error messages are accessible
- [ ] Test focus management

## Performance Tests

- [ ] Verify initial page load time is acceptable
- [ ] Check that the application remains responsive during API calls
- [ ] Verify that scrolling in the chat interface is smooth
- [ ] Test performance with a large number of messages in the chat
- [ ] Check application performance on low-end devices

## Browser Compatibility Tests

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

## Notes and Issues

Use this section to document any issues found during testing:

1. 
2. 
3. 

## Test Results

**Tester Name:**
**Date Tested:**
**Test Environment:**
**Overall Status:** 