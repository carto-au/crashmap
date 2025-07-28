<script lang="ts">
  import { CrashDegree, DEGREE_COLOR_MAP } from "./constants";
  import InlineColorDot from "./InlineColorDot.svelte";
</script>

<div class="textual-content">
  <p>
    This map shows crashes from 2016 to 2023 that were reported to the police
    and involved an injury or tow-away.
  </p>
  <!-- <ul>
      <li>Were reported to police</li>
      <li>Occurred on a road open to the public</li>
      <li>Involved at least one moving road vehicle</li>
      <li>
        Involved at least one person being killed or injured or at least one
        motor vehicle being towed away.
      </li>
    </ul> -->
  <p>
    <strong
      >Select on a dot on the map to see more information about the crash.</strong
    >
  </p>
  <dl>
    <div>
      <dt>
        <InlineColorDot color={DEGREE_COLOR_MAP[CrashDegree.Fatal]} /> Fatal
      </dt>
      <dd>Someone was killed</dd>
    </div>
    <div>
      <dt>
        <InlineColorDot color={DEGREE_COLOR_MAP[CrashDegree.Serious]} /> Serious
        Injury
      </dt>
      <dd>
        Someone was admitted to hospital on the same day or day after the crash
      </dd>
    </div>
    <div>
      <dt>
        <InlineColorDot color={DEGREE_COLOR_MAP[CrashDegree.Moderate]} />
        Moderate Injury
      </dt>
      <dd>
        Someone attended the emergency department (but was not admitted to
        hospital) on the same day or day after the crash
      </dd>
    </div>
    <div>
      <dt>
        <InlineColorDot color={DEGREE_COLOR_MAP[CrashDegree.Minor]} />
        Minor/Other Injury
      </dt>
      <dd>
        Someone was identified as an injury in the Police crash report data, but
        was not was admitted to hospital or attended the emergency department
      </dd>
    </div>
    <div>
      <dt>
        <InlineColorDot color="black" />
        Uncategorised Injury
      </dt>
      <dd>
        Someone was identified as an injury in the Police crash report data, but
        data could not be linked with health records
      </dd>
    </div>
    <div>
      <dt>
        <InlineColorDot color={DEGREE_COLOR_MAP[CrashDegree.NonCasualty]} />
        Non-casualty (towaway)
      </dt>
      <dd>
        No one was killed or injured but at least one motor vehicle was towed
        away
      </dd>
    </div>
  </dl>
  <em class="text-sm">
    *These definitions have been shortened for simplicity. See the
    <a href="/data-manual.pdf" target="_blank">data manual</a> (pg4) for full definitions.
  </em>
</div>
