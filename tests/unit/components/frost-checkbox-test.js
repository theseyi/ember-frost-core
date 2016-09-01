import {expect} from 'chai'
import Ember from 'ember'
const {$, run} = Ember
import {describeComponent} from 'ember-mocha'
import {
  beforeEach,
  describe,
  it
} from 'mocha'
import PropTypeMixin from 'ember-prop-types'
import sinon from 'sinon'

describeComponent(
  'frost-checkbox',
  'Unit: FrostCheckboxComponent',
  {
    needs: [
      'component:one-way-checkbox'
    ],

    unit: true
  },
  function () {
    let component

    beforeEach(function () {
      component = this.subject()
    })

    it('includes className frost-button', function () {
      expect(component.classNames).to.include('frost-checkbox')
    })

    it('sets default property values correctly', function () {
      expect(
        component.get('size'),
        'size: "small"'
      ).to.eql('small')

      expect(
        component.get('label'),
        'label: ""'
      ).to.eql('')

      expect(
        component.get('autofocus'),
        'autofocus: "false"'
      ).to.be.false

      expect(
        component.get('checked'),
        'checked: "false"'
      ).to.be.false

      expect(
        component.get('disabled'),
        'disabled: "false"'
      ).to.be.false

      expect(
        component.get('hook'),
        'hook: "undefined"'
      ).to.be.undefined
    })

    it('sets dependent keys correctly', function () {
      const inputIdDependentKeys = [
        'id'
      ]

      expect(
        component.inputId._dependentKeys,
        'Dependent keys are correct for inputId()'
      ).to.eql(inputIdDependentKeys)
    })

    it('has the expected Mixins', function () {
      expect(
        PropTypeMixin.detect(component),
        'PropTypeMixin Mixin is present'
      ).to.be.true
    })

    it('sets the inputId', function () {
      const testId = 99

      run(() => component.set('id', testId))

      expect(
        component.get('inputId'),
        'inputId method sets input id'
      ).to.eql('99_input')
    })

    describe('when onBlur property is omitted', function () {
      beforeEach(function () {
        run(() => {
          component.set('onBlur', undefined)
        })
      })

      it('does not throw an error when onBlur action is triggered', function () {
        expect(function () {
          component.get('actions.onBlur').call(component)
        }).not.to.throw(Error)
      })
    })

    describe('keyPress()', function () {
      const preventDefaultSpy = sinon.spy()
      const stopPropagationSpy = sinon.spy()

      const eventTestObject = {
        keyCode: 32,
        preventDefault: preventDefaultSpy,
        stopPropagation: stopPropagationSpy
      }

      beforeEach(function () {
        preventDefaultSpy.reset()
        stopPropagationSpy.reset()
      })
      it('sets state to checked', function () {
        this.render()

        run(() => component.keyPress(eventTestObject))

        expect(
          $('input').prop('checked'),
          'keyPress() sets checked state'
        ).to.be.true
      })

      it('does not set state to checked when disabled is true', function () {
        const disabled = true

        this.render()

        run(() => {
          component.set('disabled', disabled)
          component.keyPress(eventTestObject)
        })

        expect(
          $('input').prop('checked'),
          'keyPress() did not set checked state'
        ).to.be.false
      })

      it('calls preventDefault', function () {
        this.render()

        run(() => component.keyPress(eventTestObject))

        expect(
          preventDefaultSpy.called,
          'preventDefault() was called'
        ).to.be.true
      })

      it('calls stopPropogation', function () {
        this.render()

        run(() => component.keyPress(eventTestObject))

        expect(
          stopPropagationSpy.called,
          'stopPropagation() was called'
        ).to.be.true
      })

      it('returns false', function () {
        this.render()

        expect(
          run(() => component.keyPress(eventTestObject)),
          'stopPropagation() was called'
        ).to.be.false
      })

      it('calls input() action', function () {
        const spy = sinon.spy(component, 'send')

        this.render()

        run(() => component.keyPress(eventTestObject))

        expect(
          spy.args[0].join(),
          'input() was called'
        ).to.eql('input')
      })
    })
  }
)
