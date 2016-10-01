/*
<dom-module id="quest-search">
  <style is="custom-style">
    :host ::content instruction {
      display: block;
      padding: var(--vw-small);
    };
    :host ::content comment {
      display: none;
    };

    #fileselect {
      position: fixed;
      top: -100em;
    }

    #questchooser a {
      display: inline-block;
      float: right;
    }

    #quest {
      display: inline-block;
      font-size: var(--font-size-interactive);
      padding: var(--vh-base) 0;
      font-family: var(--font-body);
      border: var(--border-size) solid var(--border-color-accent);
      line-height: 1.2em;
      margin-top: var(--vh-base);
    }

    .pad {
      padding-left: var(--vw-base);
      @apply(--layout-flex-3);
      @apply(--layout-vertical);
    }

    .centered {
      text-align: center;
    }
    .centered h3 {
      margin: 0;
    }
    .centered .author {
      font-size: var(--font-size-flavortext);
      margin-bottom: var(--vw-large);
    }

    paper-dropdown-menu, paper-input {
      --paper-input-container-input: {
        font-family: inherit;
        font-size: inherit;
      }
      --paper-input-container-label: {
        font-family: var(--font-header);
      }
    }
  </style>
  <template>
    <expedition-card-set id="pages" initial="intro">
      <expedition-card title="Public Quests" data-route="intro" icon="adventurer">
        <div class="input">
          <div class="value vertical layout">
            <paper-input class="expedition-search-field" label="Search author, title, or id" value="{{searchText}}">
              <iron-icon icon="search" suffix></iron-icon>
            </paper-input>
            <paper-dropdown-menu class="expedition-search-field" label="Order By">
              <paper-menu class="dropdown-content" selected="{{order}}" attr-for-selected="value">
                <paper-item value="-published">Newest</paper-item>
                <paper-item value="+meta_title">Title</paper-item>
                <paper-item value="-meta_maxTimeMinutes">Play Time (longest)</paper-item>
                <paper-item value="+meta_minTimeMinutes">Play Time (shortest)</paper-item>
              </paper-menu>
            </paper-dropdown-menu>
            <paper-dropdown-menu class="expedition-search-field" label="Within">
              <paper-menu class="dropdown-content" selected="{{recency}}" attr-for-selected="value">
                <paper-item value="inf">All Time</paper-item>
                <paper-item value="31536000">Past Year</paper-item>
                <paper-item value="2592000">Past Month</paper-item>
                <paper-item value="604800">Past Week</paper-item>
                <paper-item value="86400">Past 24 hours</paper-item>
                <paper-item value="3600">Past hour</paper-item>
              </paper-menu>
            </paper-dropdown-menu>
              <expedition-checkbox label="Owned Only" value="{{selfOwned}}">
                Show public, unlisted, and private quests owned by you.
              </expedition-checkbox>
          </div>
        </div>
        <expedition-button id="search" on-tap="_onSearch">Search</expedition-button>
      </expedition-card>
      <expedition-card title="Search Results"  data-route="results" on-return="prev">
        <template is="dom-if" if="{{loading}}">
          Loading...
        </template>
        <template is="dom-repeat" items="{{quests}}">
          <expedition-item on-tap="_onQuestTap" data-target$="{{index}}">
            <h1>{{item.title}}</h1>
            <div>by {{item.author}}</div>
            <div>{{item.num_players}} players, {{item.play_period}}</div>
            <template is="dom-if" if="{{item.abnormal_share_state}}">
              <div><strong>{{item.abnormal_share_state}}</div></div>
            </template>
          </expedition-item>
        </template>
        <template is="dom-if" if="{{!quests.length}}">
          No quests found.
        </template>
      </expedition-card>
      <expedition-card title="Quest Details"  data-route="details" on-return="prev">
        <div class="centered">
          <h3>{{quest.title}}</h3>
          <div class="author">by {{quest.author}}</div>
          <p>
            {{quest.summary}}
          </p>
        </div>
        <expedition-indicator icon="helper">
          <div>URL: <a href="{{quest.url}}" target="_blank">{{quest.shorturl}}</a></div>
          <div>Email: {{quest.email}}</div>
          <div>Players: {{quest.num_players}}</div>
          <div>Play time: {{quest.play_period}}</div>
          <div>Last update: {{quest.modified}}</div>
          <template is="dom-if" if="{{quest.user_owned}}">
            <div>{{quest.created}}</div>
            <div>{{quest.published}}</div>
          </template>
        </expedition-indicator>
        <expedition-button on-tap="_onQuestPlay" data-target$="{{quest}}">Play</expedition-button>
      </expedition-card>
    </expedition-card-set>
    <expedition-dialog title="Disclaimer" id="disclaimer" on-dialog-close="_onDialogClose">
      <p>
        Community quests are published by other adventurers like yourselves. We offer no guarantees
        of completeness, correctness of grammar, or sanity in any of the quests you are about to see.
      </p>
      <p>
        We use your basic Google account information as your identity when rating quests and to show your
        own (unpublished) quests. You can continue without logging in, but you will only be able to play
        a small selection of offline, featured quests.
      </p>
      <expedition-button on-tap="_onLogin">Continue with Google</expedition-button>
      <expedition-button on-tap="_onDefault">Show default quests only</expedition-button>
    </expedition-dialog>
  </template>
  <script>
    Polymer({
      is: 'quest-search',
      behaviors: [GlobalsBehaviour],
      ready: function() {
        this.loggedIn = ExpeditionAPI.isLoggedIn();
        this.quests=[];
        this.userOwnedQuest = false;
        this.order = "-published";
        this.recency = "inf";
        this.FEATURED = [
          {
            xml_url: "quests/build/oust_albanus.xml",
            title: "Oust Albanus",
            summary: "Your party encounters a smelly situation.",
            author: "Scott Martin",
            email: "smartin015@gmail.com",
            play_period: this._formatPlayPeriod(20, 40),
            num_players: '2-4'
          },
          {
            xml_url: "quests/build/mistress_malaise.xml",
            title: "Mistress Malaise",
            summary: "Mystery, Misfortune, and a Mistress.",
            author: "Scott Martin",
            email: "smartin015@gmail.com",
            play_period: this._formatPlayPeriod(20, 40),
            num_players: '2-4'
          }
        ];
      },
      _onDefault: function() {
        this.$.disclaimer.close();
        this.$.pages.next('results');
        this.quests = this.FEATURED;
      },
      _onLogin: function() {
        ExpeditionAPI.login(function(locals) {
          this.loggedIn = ExpeditionAPI.isLoggedIn();
          console.log(locals);
          this.loading = true;
          this.$.disclaimer.close();
          this._onSearch();
        }.bind(this));
      },
      _onDialogClose: function() {
        console.log("herp");
        if (!ExpeditionAPI.isLoggedIn()) {
          console.log("Derp");
          this.showCommunity = false;
        }
      },
      _truncate: function(s, n) {
        return s.substr(0,n-1)+(s.length>n?'&hellip;':'');
      },
      _formatDate: function(rfcDateTime) {
        if (!rfcDateTime) {
          return "unknown";
        }
        return rfcDateTime.split('T')[0];
      },
      _formatPlayPeriod: function(minMinutes, maxMinutes) {
        if (minMinutes > 60 && maxMinutes > 60) {
          return Math.round(minMinutes / 60) + '-' + Math.round(maxMinutes / 60) + " hours";
        } else {
          return minMinutes + '-' + maxMinutes + " minutes";
        }
      },
      _formatAbnormalShareState: function(published, shared) {
        if (!published && !shared) {
          return "PRIVATE";
        }
        if (!published && shared) {
          return "UNLISTED";
        }
        return null;
      },
      _formattedQuest: function(quest) {
        return {
          id: quest.id,
          xml_url: quest.url,
          title: quest.meta_title,
          summary: quest.meta_summary,
          modified: this._formatDate(quest.modified),
          url: quest.meta_url,
          shorturl: this._truncate(quest.meta_url, 20),
          author: quest.meta_author,
          email: quest.meta_email,
          play_period: this._formatPlayPeriod(quest.meta_minTimeMinutes, quest.meta_maxTimeMinutes),
          num_players: quest.meta_minPlayers + '-' + quest.meta_maxPlayers,
          created: this._formatDate(quest.created),
          published: this._formatDate(quest.published),
          abnormal_share_state: this._formatAbnormalShareState(quest.published, quest.shared),
          reported: false,
          user_owned: Boolean(quest.user === ExpeditionAPI.getLoggedInUser())
        };
      },
      _onQuestTap: function(e) {
        var idx = e.currentTarget.dataset.target;
        this.quest = this.quests[idx];
        this.$.pages.next('details');
      },
      _onQuestPlay: function(e) {
        var quest = e.currentTarget.dataset.target;
        this.fire('quest-select', quest);
      },
      _onSearch: function() {
        if (!ExpeditionAPI.isLoggedIn()) {
          this.$.disclaimer.open();
          return;
        }
        var params = {};

        if (this.selfOwned) {
          params.owner = ExpeditionAPI.getLoggedInUser().id;
        }

        params.players = this.globals.adventurers;

        if (this.searchText) {
          params.search = this.searchText;
        }

        if (this.recency && this.recency !== "inf") {
          params.published_after = Math.floor(Date.now() / 1000) - parseInt(this.recency);
        }

        if (this.order) {
          params.order = this.order;
        }

        ExpeditionAPI.searchQuests(params, function(result) {
          if (result.error) {
            console.log(result.error);
          }
          this.loading = false;
          this.quests = result.quests.map(this._formattedQuest.bind(this));
          console.log(this.quests);
        }.bind(this));
        this.$.pages.next('results');
      },
      prev: function(e) {
        // TODO: Dedupe this across various elements.
        var p = Polymer.dom(e.srcElement).previousSibling;
        while (p.tagName !== "EXPEDITION-CARD") {
          p = p.previousSibling;
        }
        this.$.pages.prev(p.dataset.route);
        e.stopPropagation();
      },
      properties: {
        quest: Object,
        showCommunity: Boolean,
      }
    });
  </script>
</dom-module>
*/