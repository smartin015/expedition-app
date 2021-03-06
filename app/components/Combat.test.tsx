test('Loot returns viable value with tier sum = 1', function() {
  var loot = calculateLoot({
    tier: 1,
  });
  // TODO assert valid
  throw new Error 'Not finished implementing';
});


/*
test('help text is hidden when global setting set', function() {
  f.globals.helplevel = 0;
  var thresh = 4;  // Number of non-template objects in zero-help mode should never exceed this amount.
  var allpages = f.$.pages.querySelectorAll("expedition-card");
  Polymer.dom.flush();
  for (var j = 0; j < allpages.length; j++) {
    var p = allpages[j];
    var children = p.getEffectiveChildren();
    var cnt = 0;
    for (var i = 0; i < children.length; i++) {
      if (children[i].tagName === "TEMPLATE") {
        continue;
      }
      cnt++;
    }
    assert.isBelow(cnt, thresh, 'Non-template objects in "'+p.getAttribute('title')+'" below ' + thresh);
  }

});

test('enemy set always displayed on combat setup', function() {
  f.encounter = [{name: "a"}, {name: "b"}];
  Polymer.dom.flush();
  var combatSetupText = getPageText(f, 'combatsetup');
  assert.include(combatSetupText, "a (Tier 1 classa)");
  assert.include(combatSetupText, "b (Tier 2 classb)");
});

test('enemy tier sum calculated from enemies', function() {
  f.encounter = [{name: "a"}, {name: "b"}];
  Polymer.dom.flush();
  var combatAdjustText = getPageText(f, 'combatadjust');
  assert.include(combatAdjustText, "Tier Sum: 3");
});

test('player count initially based on global player count', function() {
  f.globals.adventurers = 4;
  f.ready();
  var combatDmgText = getPageText(f, 'combatdmg');
  assert.include(combatDmgText, "Adventurers: 4");
});

test('original player count persists despite global change after ready', function() {
  f.globals.adventurers = 4;
  f.ready();
  f.globals.adventurers = 6;
  var combatDmgText = getPageText(f, 'combatdmg');
  assert.include(combatDmgText, "Adventurers: 4");
});

test('enemy tier sum persists between combat rounds', function() {
  f.tierSum = 5;
  f.next(fakeTap('combattimer'));
  f.$.timer.fire('stopped', {turnTimeMillis: 500});
  f.next(fakeTap('combattimer'));
  f.$.timer.fire('stopped', {turnTimeMillis: 500});
  assert.equal(f.tierSum, 5);
});

test('timer started when switched to', function() {
  f.tierSum = 5;
  f.next(fakeTap('combattimer'));
  assert.equal(f.$.timer.active, true);
});

test('timer end switches to roll/resolve stage if no surge', function(done) {
  f.tierSum = 5;
  f.next(fakeTap('combattimer'));
  f.$.timer.stop();

  setTimeout(function() {
    assert.equal(f.$.pages.getCurrentPage(), 'combatroll');
    done();
  }, 50);
});

test('timer end switches to surge stage if combat surge occurs', function(done) {
  f.tierSum = 5;
  playUntilSurge(f, function() {
    assert.equal(f.$.pages.getCurrentPage(), 'combatsurge');
    done();
  })
});

test('surge Next moves to roll/resolve stage', function(done) {
  f.tierSum = 5;
  playUntilSurge(f, function() {
    f.next(fakeElemTap(f.$.pages.querySelector("#surgecard").querySelector("a")));
    assert.equal(f.$.pages.getCurrentPage(), 'combatroll')
    done();
  });
});

test('player damage shown', function() {
  f.tierSum = 5;
  f.next(fakeTap('combattimer'));
  f.$.timer.stop();

  setTimeout(function() {
    f.next(fakeTap('combatdmg'));
    assert.include(
  }, 50);
});

test('end encounter buttons with Victory text cause victory or defeat as appropriate', function() {
  goToEnd(f, true);
  assert.equal(f.endType.toLowerCase(), "victory");
});

test('loot and abilities not shown on defeat', function(done) {
  // Requires at least one round to set max tier.
  f.tierSum = 5;
  f.next(fakeTap('combattimer'));
  f.$.timer.stop();

  setTimeout(function() {
    goToEnd(f, false);
    assert.notInclude(getPageText(f, 'combatend'), "Draw loot");
    done();
  }, 60);
});

test('loot and/or abilities shown on victory', function(done) {
  f.tierSum = 5;
  f.next(fakeTap('combattimer'));
  f.$.timer.stop();

  setTimeout(function() {
    goToEnd(f, true);
    Polymer.dom.flush();
    assert.include(getPageText(f, 'combatend'), "Draw loot");
    done();
  });
});

test('multitouch #fingers required uses the live adventurer count', function() {
  assert.equal(this.$.timer.adventurers, this.adventurers);
});

test('if timer ran for too long, nagging popup dialog shows', function() {
  assert.equal(this.$.nag.isOpen(), true);
});

test('nagging dialog shows up even if combat resulted in a surge', function() {
  throw new Error('unimplemented');
});

test('back button at terminal states should show a dialog', function() {
  throw new Error('unimplemented');
});

test('back button at non-terminal states should go back', function() {
  throw new Error('unimplemented');
});

test('back button should wrap around from prepforcombat to combatdmg', function() {
  throw new Error('unimplemented');
});

test('end combat stats should be non-NaN', function() {
  throw new Error('unimplemented');
});

*/