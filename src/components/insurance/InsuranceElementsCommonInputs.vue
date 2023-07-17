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
            <td>referrerSiteCode</td>
            <td>Yes</td>

            <td>This is the sitecode we have supplied you with</td>
          </tr>
          <tr>
            <td>accesstoken</td>
            <td>No</td>

            <td>Pass null if no access token available</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
