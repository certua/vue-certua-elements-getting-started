<script setup lang="ts"></script>

<template>
  <div>
    <h4>Base inputs</h4>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <th>Property Name</th>
          <th>Mandatory</th>

          <th>Description</th>
        </thead>
        <tbody>
          <tr>
            <td>config</td>
            <td>Yes</td>

            <td>
              This contains information on the site you are integrating the quote and buy journey
              integration<br /><code
                >{ referrerId: 'xxxx-xxxx-xxxx-xxxx', basePath: 'components/quote-and-buy', popup:
                false }</code
              >
            </td>
          </tr>
          <tr>
            <td>accesstoken</td>
            <td>Yes</td>

            <td>Pass null if no access token available or for anonymous journey</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
