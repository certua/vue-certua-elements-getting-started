<script setup lang="ts"></script>

<template>
  <div>
    <h4>Base inputs</h4>

    <div class="table-responsive">
      <table class="table">
        <thead>
          <th>Property Name</th>
          <th>Mandatory</th>
          <th>Region</th>
          <th>Description</th>
        </thead>
        <tbody>
          <tr>
            <td>contextData</td>
            <td>Yes</td>
            <td>All</td>
            <td>
              This is a JSON string which contains your context token, user reference and
              link_metadata (only required for AU) object. Context token and link_metadata are both
              returned from the token call.
              <br /><code>
                {"contextToken":"FF5D16AAE1ED74E4C8F0E8B6D9E2EB06","ownerId":"1","dateCreated":"2023-03-20T11:17:24.121Z",
                "link_metadata": { "enabled": true, "token": "MaM2Mz1O72X5SV71dxHWUppgnHpV",
                "link_config_id": "clientname_au_agg_prod", "callback_template_url":
                "https://apistg-au.certua.io/daas/ob/link-callback/c12f3e69-b559-40f6-b6b1-83b4d1e1f848/{providerId}/{linkFlowId}/{linkFlowResultId}"
                }
              </code>
            </td>
          </tr>
          <tr>
            <td>daasUrl</td>
            <td>No</td>
            <td>All</td>
            <td>
              This only needs to be passed in if you wish to load the Daas Elements from your own
              CDN rather than Certua's. Must be an absolute URL.
            </td>
          </tr>
          <tr>
            <td>notificationSettings</td>
            <td>No</td>
            <td>All</td>
            <td>
              This is JSON which contains any custom notification settings required for your
              implementation. By default this property is not required if you simply wish to use the
              default style toastrs.<br />
              Manual Notifications: if this is set to true then toastrs are disabled entirely and
              the host will be required to listen to 'certua-ob-notifications' channel on the
              eventbus.
              <br />Use External Toastr Styles: Intended for Internal Certua use, this leaves
              toastrs outside of the shadow dom and the host app has to manage ngx-toastr stylesheet
              <br />
              <code> { "manualNotifications": "boolean" , "useHostToastrStyles": "boolean" } </code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
