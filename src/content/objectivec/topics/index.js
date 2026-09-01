// Objective-C topic tree.
//
// Each node is a ConceptNode: { id, title, level, slug, concepts[], children[] }.
// Routable nodes carry a `slug`. Every Concept renders in the fixed order
// code -> note -> example (example optional).

/** @type {import('@/lib/content').ConceptNode[]} */
const topics = [
  // 1. Getting Started
  {
    id: "objc-getting-started",
    title: "Getting Started",
    level: 1,
    slug: "getting-started",
    concepts: [],
    children: [
      {
        id: "objc-hello-world",
        title: "Your First Program",
        level: 2,
        slug: "hello-world",
        concepts: [
          {
            id: "objc-hello-main",
            code: "#import <Foundation/Foundation.h>\n\nint main(int argc, const char *argv[]) {\n  @autoreleasepool {\n    NSLog(@\"Hello, world!\");\n  }\n  return 0;\n}",
            note: "Objective-C is a superset of C, so a program still starts at `main`. `#import` includes a framework header just like `#include` but guards against double inclusion. `NSLog` prints a message with a timestamp, and the `@autoreleasepool` block manages temporary objects.",
            explanation: {
              heading: 'Anatomy of a first program',
              intro: 'Every Objective-C program is also a C program, so execution begins at the main function. The Foundation framework supplies the core object types, and an autorelease pool cleans up temporary objects created while the program runs.',
              points: [
                { term: 'import', detail: 'The at-import directive pulls in a framework header once, avoiding the repeated-inclusion problems that plain include can cause.' },
                { term: 'autorelease pool', detail: 'The autoreleasepool block drains temporary objects that were autoreleased inside it, freeing memory at the end of the block.' },
                { term: 'NSLog', detail: 'NSLog writes a formatted message with a timestamp to the console, and it accepts the same format placeholders as printf plus the object placeholder.' },
                { term: 'return value', detail: 'Returning zero from main signals that the process finished successfully, exactly as in C.' },
              ],
            },
          },
          {
            id: "objc-nsstring-literal",
            code: "NSString *greeting = @\"Hello\";\nint count = 42;\nNSLog(@\"%@ has %d characters counted as %lu\", greeting, count, (unsigned long)[greeting length]);",
            note: "The `@\"...\"` syntax creates an `NSString` literal, distinct from a C string. In format strings, `%@` prints any object via its description, while C specifiers like `%d` handle primitives. Objects are almost always referenced through pointers, hence the `*`.",
            explanation: {
              heading: 'String literals and object pointers',
              intro: 'The at-quote syntax builds a full NSString object rather than a bare C character array. Objects live on the heap and are handled through pointers, which is why an NSString variable is declared with a star.',
              points: [
                { term: 'NSString literal', detail: 'The at sign before a quoted string produces an immutable NSString instance instead of a C string.' },
                { term: 'object pointer', detail: 'The star marks a pointer to an object, since Objective-C objects are always accessed by reference.' },
                { term: 'object placeholder', detail: 'The percent-at placeholder asks any object for its description text, so it works for strings, numbers, and custom classes alike.' },
                { term: 'primitive placeholders', detail: 'C style placeholders such as percent-d still print plain integers and other primitives.' },
              ],
            },
          },
          {
            id: "objc-format-specifiers",
            code: "NSLog(@\"obj=%@ int=%d long=%ld uint=%lu\", obj, 7, 9L, 3UL);\nNSLog(@\"float=%.2f hex=%x char=%c ptr=%p\", 3.14159, 255, 'A', ptr);\nNSLog(@\"bool=%d\", (int)YES);   // print BOOL as an int",
            note: "Format specifiers must match their arguments' types: `%@` for objects, `%d`/`%ld` for int/long, `%f` for doubles, `%x` for hex, and `%p` for pointers. A mismatch (like passing a long to `%d`) produces garbage or warnings, so cast integer types explicitly.",
            explanation: {
              heading: 'Matching placeholders to argument types',
              intro: 'A format string reads its extra arguments positionally, and each placeholder tells the runtime how to interpret the bytes it receives. When a placeholder does not match the real argument type the output is wrong and the compiler often warns.',
              points: [
                { term: 'objects', detail: 'The percent-at placeholder prints an object by calling its description method.' },
                { term: 'integers', detail: 'Use percent-d for int and percent-ld for long, and cast the value so its width matches the placeholder on every platform.' },
                { term: 'floats and hex', detail: 'The percent-f placeholder prints doubles and percent-x prints an integer in hexadecimal.' },
                { term: 'pointers', detail: 'The percent-p placeholder prints a raw pointer address, which is handy when debugging object identity.' },
              ],
            },
            example: "// %.2f prints 3.14; the number after the dot is precision",
          },
        ],
        children: [],
      },
      {
        id: "objc-messaging",
        title: "Message Syntax",
        level: 2,
        slug: "messaging",
        concepts: [
          {
            id: "objc-message-send",
            code: "NSString *text = @\"hello\";\nNSString *upper = [text uppercaseString];\nNSString *joined = [text stringByAppendingString:@\" world\"];",
            note: "Objective-C calls methods by sending messages in square brackets: `[receiver message]`. Methods with arguments interleave the name and the values, as in `stringByAppendingString:`. This keyword-style naming makes calls read almost like sentences.",
            explanation: {
              heading: 'Sending messages in brackets',
              intro: 'Objective-C does not call methods directly; instead it sends a message to a receiver, and the runtime looks up which method should respond. The square-bracket form names the receiver on the left and the message on the right.',
              points: [
                { term: 'receiver', detail: 'The object on the left of the brackets is the receiver that will handle the message.' },
                { term: 'selector', detail: 'The message name, such as uppercaseString, is a selector that the runtime maps to an actual method implementation.' },
                { term: 'keyword arguments', detail: 'Arguments are interleaved with the method name, so stringByAppendingString colon reads its argument right after the label.' },
                { term: 'dynamic dispatch', detail: 'Because lookup happens at runtime, the same message can reach different implementations depending on the receiver class.' },
              ],
            },
          },
          {
            id: "objc-nil-messaging",
            code: "NSString *maybe = nil;\nNSUInteger len = [maybe length]; // returns 0, no crash",
            note: "Sending a message to `nil` is safe and simply returns a zero value (0, nil, or NO) rather than crashing. This differs sharply from many languages where calling a method on null throws. It lets you skip many explicit null checks, though it can also hide bugs.",
            explanation: {
              heading: 'Messaging nil is safe',
              intro: 'In Objective-C sending any message to nil does nothing and returns a zeroed value, so the program keeps running instead of crashing. This behavior removes many defensive checks but can also let logic errors pass silently.',
              points: [
                { term: 'no crash', detail: 'A message to nil is simply ignored rather than raising a null pointer fault.' },
                { term: 'zero result', detail: 'The return is a zero value that fits the return type, meaning zero for numbers, nil for objects, and NO for booleans.' },
                { term: 'fewer guards', detail: 'You can often chain calls without wrapping each one in a nil check.' },
                { term: 'hidden bugs', detail: 'Because failures are quiet, an unexpected nil can make a whole expression evaluate to zero without any warning.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 2. Classes & Objects
  {
    id: "objc-classes",
    title: "Classes & Objects",
    level: 1,
    slug: "classes",
    concepts: [],
    children: [
      {
        id: "objc-interface-implementation",
        title: "Interface & Implementation",
        level: 2,
        slug: "interface-implementation",
        concepts: [
          {
            id: "objc-class-declaration",
            code: "// Person.h\n@interface Person : NSObject\n- (void)sayHello;\n@end\n\n// Person.m\n@implementation Person\n- (void)sayHello {\n  NSLog(@\"Hi!\");\n}\n@end",
            note: "A class is split into an `@interface` (the public declaration, usually in a .h header) and an `@implementation` (the method bodies, in a .m file). `: NSObject` means the class inherits from the root object class. This separation keeps the public API distinct from its internals.",
            explanation: {
              heading: 'Interface and implementation split',
              intro: 'An Objective-C class is described in two parts: an interface that lists what the class offers and an implementation that provides the actual code. Splitting them keeps the public contract in a header while the details stay in the source file.',
              points: [
                { term: 'interface', detail: 'The at-interface section declares the class name, superclass, and the methods and properties callers may use.' },
                { term: 'implementation', detail: 'The at-implementation section contains the method bodies and lives in a dot-m source file.' },
                { term: 'root class', detail: 'Inheriting from NSObject gives the class core behavior such as allocation, retain counting, and equality.' },
                { term: 'header separation', detail: 'Keeping declarations in a dot-h file lets other files import the API without seeing the internals.' },
              ],
            },
          },
          {
            id: "objc-create-object",
            code: "Person *p = [[Person alloc] init];\n[p sayHello];\n// Modern shorthand:\nPerson *p2 = [Person new];",
            note: "Objects are created in two steps: `alloc` reserves memory and `init` sets up the initial state, chained together. `[Person new]` is a convenience that combines both. You then send messages to the resulting instance pointer.",
            explanation: {
              heading: 'Two-step object creation',
              intro: 'Creating an object separates raw memory allocation from initialization. Alloc carves out and zeroes the storage, then init prepares the object for use, and the two are almost always chained together.',
              points: [
                { term: 'alloc', detail: 'The alloc class method reserves memory for an instance and sets every field to zero.' },
                { term: 'init', detail: 'The init instance method configures starting state and returns the ready-to-use object.' },
                { term: 'new shorthand', detail: 'Sending new to the class combines alloc and init into a single convenient call.' },
                { term: 'instance pointer', detail: 'The result is a pointer to the fresh instance that you then send further messages to.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "objc-instance-class-methods",
        title: "Instance vs Class Methods",
        level: 2,
        slug: "instance-class-methods",
        concepts: [
          {
            id: "objc-method-prefixes",
            code: "@interface Calculator : NSObject\n- (int)addTo:(int)value;      // instance method (dash)\n+ (Calculator *)shared;       // class method (plus)\n@end",
            note: "A leading `-` marks an instance method, called on a specific object, while a leading `+` marks a class method, called on the class itself. Class methods are commonly used for factory constructors and shared singletons. Both are declared the same way otherwise.",
            explanation: {
              heading: 'Instance versus class methods',
              intro: 'The first character of a method declaration decides whether it belongs to individual objects or to the class as a whole. A dash means the method runs on an instance, while a plus means it runs on the class itself.',
              points: [
                { term: 'dash prefix', detail: 'A leading dash declares an instance method that operates on the state of one object.' },
                { term: 'plus prefix', detail: 'A leading plus declares a class method that is sent to the class name rather than an instance.' },
                { term: 'factories', detail: 'Class methods often act as factory constructors that build and return new instances.' },
                { term: 'singletons', detail: 'A class method is the usual way to expose a single shared instance for the whole app.' },
              ],
            },
          },
          {
            id: "objc-calling-methods",
            code: "Calculator *c = [Calculator shared];   // class method\nint result = [c addTo:5];               // instance method",
            note: "Send a class method to the class name and an instance method to an object. This example uses a class method to obtain a shared instance, then an instance method to operate on it. The receiver on the left determines which kind of method is looked up.",
            explanation: {
              heading: 'Choosing the right receiver',
              intro: 'Whether a call resolves to a class method or an instance method depends entirely on what sits to the left inside the brackets. A class name receives class methods and an object receives instance methods.',
              points: [
                { term: 'class receiver', detail: 'Sending a message to the class name invokes the plus method, useful for building or fetching instances.' },
                { term: 'instance receiver', detail: 'Sending a message to an object invokes the dash method that acts on that object.' },
                { term: 'shared then operate', detail: 'The example first asks the class for a shared object and then sends it an instance message.' },
                { term: 'lookup by receiver', detail: 'The runtime picks the implementation based on the receiver, so the same selector name can exist on both sides.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 3. Properties
  {
    id: "objc-properties",
    title: "Properties",
    level: 1,
    slug: "properties",
    concepts: [],
    children: [
      {
        id: "objc-property-basics",
        title: "Declaring Properties",
        level: 2,
        slug: "property-basics",
        concepts: [
          {
            id: "objc-property-declaration",
            code: "@interface Person : NSObject\n@property (nonatomic, copy) NSString *name;\n@property (nonatomic, assign) NSInteger age;\n@end",
            note: "`@property` declares a piece of state and auto-synthesizes a getter and setter plus a backing instance variable. It removes the boilerplate of writing accessor methods by hand. The attributes in parentheses fine-tune the generated behavior.",
            explanation: {
              heading: 'Declaring state with property',
              intro: 'The at-property directive declares a named piece of state and asks the compiler to generate the accessor methods and hidden storage for it. This replaces the tedious job of writing a matching getter and setter by hand.',
              points: [
                { term: 'auto accessors', detail: 'The compiler synthesizes a getter and a setter that read and write the value.' },
                { term: 'backing ivar', detail: 'A hidden instance variable, named with a leading underscore by default, actually holds the value.' },
                { term: 'attributes', detail: 'The parenthesized keywords tune memory and threading behavior of the generated code.' },
                { term: 'less boilerplate', detail: 'One property line replaces several lines of manual accessor and storage declarations.' },
              ],
            },
          },
          {
            id: "objc-property-attributes",
            code: "@property (nonatomic, strong) NSArray *items;   // owns object\n@property (nonatomic, weak) id delegate;         // no ownership\n@property (nonatomic, copy) NSString *title;     // copies on set\n@property (nonatomic, readonly) BOOL isReady;    // getter only",
            note: "Attributes control memory and access semantics. `strong` keeps an object alive, `weak` avoids retain cycles, and `copy` stores an independent copy on assignment. `nonatomic` skips thread-safety locking for speed, and `readonly` omits the setter.",
            explanation: {
              heading: 'Tuning properties with attributes',
              intro: 'Property attributes tell the compiler how the generated accessors should manage memory, threading, and access. Choosing the right combination is central to correct memory management under automatic reference counting.',
              points: [
                { term: 'strong', detail: 'A strong reference retains the object and keeps it alive as long as the property holds it.' },
                { term: 'weak', detail: 'A weak reference does not retain the object and becomes nil automatically when the object is freed, which breaks retain cycles.' },
                { term: 'copy', detail: 'A copy setter stores an independent duplicate, protecting the value from later mutation by the caller.' },
                { term: 'nonatomic and readonly', detail: 'Nonatomic skips the extra locking that guards atomic access, and readonly generates only a getter.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "objc-dot-syntax",
        title: "Accessing Properties",
        level: 2,
        slug: "dot-syntax",
        concepts: [
          {
            id: "objc-property-access",
            code: "Person *p = [Person new];\np.name = @\"Ada\";        // dot syntax setter\nNSString *n = p.name;    // dot syntax getter\n[p setName:@\"Bob\"];      // equivalent message send",
            note: "Dot syntax `p.name` is a readable shorthand that the compiler translates into the underlying getter or setter messages. It is purely syntactic sugar over message sending. Use it for properties and reserve bracket syntax for behavioral methods.",
            explanation: {
              heading: 'Dot syntax over messages',
              intro: 'Dot syntax offers a compact way to read and write properties, but it is only a convenience that the compiler rewrites into ordinary accessor messages. It changes how the code looks, not what actually runs.',
              points: [
                { term: 'getter rewrite', detail: 'Reading a dot expression compiles into a call to the property getter method.' },
                { term: 'setter rewrite', detail: 'Assigning through a dot compiles into a call to the property setter method.' },
                { term: 'equivalent forms', detail: 'The dot form and the bracket setName form produce identical behavior.' },
                { term: 'style guidance', detail: 'Reserve dot syntax for state access and use brackets for methods that perform actions.' },
              ],
            },
          },
          {
            id: "objc-custom-accessor",
            code: "@implementation Person\n- (void)setName:(NSString *)name {\n  _name = [name copy];\n  NSLog(@\"name changed to %@\", _name);\n}\n@synthesize name = _name;\n@end",
            note: "You can override a synthesized accessor to add behavior; the compiler still generates the other one. `@synthesize name = _name` names the backing ivar explicitly, which is useful when you provide a custom getter or setter that must touch the storage directly.",
            explanation: {
              heading: 'Overriding a synthesized accessor',
              intro: 'You can hand-write one accessor while still letting the compiler generate the other, which is handy when a setter needs a side effect. Naming the backing variable with at-synthesize gives your custom code direct access to the storage.',
              points: [
                { term: 'partial override', detail: 'Writing your own setter still lets the compiler synthesize the matching getter.' },
                { term: 'side effects', detail: 'A custom setter can log, validate, or copy the value before storing it.' },
                { term: 'synthesize ivar', detail: 'The at-synthesize line names the backing instance variable, here the underscore name, so your code can assign it directly.' },
                { term: 'copy on set', detail: 'Copying the incoming string in the setter prevents a mutable argument from changing the stored value later.' },
              ],
            },
            example: "// Overriding both accessors requires @synthesize for the ivar",
          },
        ],
        children: [],
      },
    ],
  },

  // 4. Initializers
  {
    id: "objc-initializers",
    title: "Initializers",
    level: 1,
    slug: "initializers",
    concepts: [],
    children: [
      {
        id: "objc-custom-init",
        title: "Custom Initializers",
        level: 2,
        slug: "custom-init",
        concepts: [
          {
            id: "objc-designated-init",
            code: "@implementation Person\n- (instancetype)initWithName:(NSString *)name age:(NSInteger)age {\n  self = [super init];\n  if (self) {\n    _name = [name copy];\n    _age = age;\n  }\n  return self;\n}\n@end",
            note: "A custom initializer sets up an object with starting values. The `self = [super init]` line runs the superclass setup and guards against it returning nil. Returning `instancetype` lets subclasses inherit the correct return type. This is the designated initializer pattern.",
            explanation: {
              heading: 'The designated initializer',
              intro: 'A designated initializer is the primary entry point that fully prepares an object, taking all the values it needs. It first lets the superclass initialize its part, then sets up the fields this class adds.',
              points: [
                { term: 'super first', detail: 'Assigning self from super init runs the parent setup and lets self be reassigned if the parent returns a different object.' },
                { term: 'nil guard', detail: 'The if self check skips field setup when the superclass initialization fails and returns nil.' },
                { term: 'instancetype', detail: 'Returning instancetype tells the compiler the result matches the receiving class, so subclasses get the correct type.' },
                { term: 'field setup', detail: 'Inside the guard the initializer copies or assigns the incoming values into the backing variables.' },
              ],
            },
          },
          {
            id: "objc-convenience-init",
            code: "- (instancetype)initWithName:(NSString *)name {\n  return [self initWithName:name age:0];\n}\n\nPerson *p = [[Person alloc] initWithName:@\"Ada\" age:36];",
            note: "A convenience initializer supplies defaults and funnels into the designated initializer, avoiding duplicated setup logic. Callers pick whichever initializer matches the data they have. Keeping one designated initializer as the single source of truth simplifies maintenance.",
            explanation: {
              heading: 'Convenience initializers funnel down',
              intro: 'A convenience initializer offers an easier entry point that fills in defaults and then delegates to the designated initializer. All real setup stays in one place, so there is only a single source of truth.',
              points: [
                { term: 'defaults', detail: 'The convenience version supplies sensible default arguments the caller did not provide.' },
                { term: 'self delegation', detail: 'It calls self initWithName colon age colon rather than super, chaining to the designated initializer on the same object.' },
                { term: 'single source', detail: 'Because every path funnels through one initializer, setup logic is written only once.' },
                { term: 'caller choice', detail: 'Callers pick whichever initializer matches the data they already hold.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 5. Inheritance & Overriding
  {
    id: "objc-inheritance",
    title: "Inheritance & Overriding",
    level: 1,
    slug: "inheritance",
    concepts: [],
    children: [
      {
        id: "objc-subclassing",
        title: "Subclassing",
        level: 2,
        slug: "subclassing",
        concepts: [
          {
            id: "objc-subclass-basic",
            code: "@interface Animal : NSObject\n- (NSString *)sound;\n@end\n\n@interface Dog : Animal\n@end\n\n@implementation Dog\n- (NSString *)sound { return @\"Woof\"; }\n@end",
            note: "A subclass names its superclass after the colon and inherits its methods and properties. `Dog` inherits everything from `Animal` and can add or override behavior. Objective-C supports single inheritance, so a class has exactly one superclass.",
            explanation: {
              heading: 'Single inheritance basics',
              intro: 'A subclass extends one superclass, gaining all of its methods and properties for free. The subclass can then add new behavior or replace inherited behavior by defining a method with the same name.',
              points: [
                { term: 'superclass colon', detail: 'The class after the colon in the interface is the single parent whose members are inherited.' },
                { term: 'inheritance', detail: 'Dog automatically has every method and property that Animal declares.' },
                { term: 'override', detail: 'Defining sound in Dog replaces the inherited version for Dog instances.' },
                { term: 'single parent', detail: 'Objective-C allows only one superclass, using protocols rather than multiple inheritance for shared contracts.' },
              ],
            },
          },
          {
            id: "objc-super-call",
            code: "@implementation Puppy\n- (NSString *)sound {\n  NSString *base = [super sound];\n  return [base stringByAppendingString:@\" (softly)\"];\n}\n@end",
            note: "Call `[super method]` to invoke the superclass version of an overridden method, letting you extend rather than fully replace behavior. This is common when overriding lifecycle methods where the parent's work must still run. The `super` keyword targets the inherited implementation.",
            explanation: {
              heading: 'Extending with super',
              intro: 'When you override a method you often want to add to the parent behavior rather than throw it away. Sending a message to super runs the inherited implementation so you can build on top of its result.',
              points: [
                { term: 'super keyword', detail: 'Messaging super dispatches to the superclass implementation while still using the same object as the receiver.' },
                { term: 'extend not replace', detail: 'Calling super and then adjusting the result lets you augment rather than fully rewrite the behavior.' },
                { term: 'lifecycle methods', detail: 'Framework lifecycle methods frequently require calling super so the parent can complete its own setup or teardown.' },
                { term: 'ordering', detail: 'Where you place the super call, before or after your own work, controls how the two contributions combine.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 6. Categories & Extensions
  {
    id: "objc-categories",
    title: "Categories & Extensions",
    level: 1,
    slug: "categories",
    concepts: [],
    children: [
      {
        id: "objc-categories-topic",
        title: "Categories",
        level: 2,
        slug: "categories-topic",
        concepts: [
          {
            id: "objc-category-basic",
            code: "@interface NSString (Reversing)\n- (NSString *)reversedString;\n@end\n\n@implementation NSString (Reversing)\n- (NSString *)reversedString {\n  // ... build reversed copy ...\n  return self;\n}\n@end",
            note: "A category adds methods to an existing class, even one you do not own like `NSString`, without subclassing. The category name in parentheses documents its purpose. Every instance of the class gains the new methods at runtime.",
            explanation: {
              heading: 'Adding methods with categories',
              intro: 'A category attaches new methods to a class that already exists, even a framework class you cannot edit, without creating a subclass. Once loaded, the added methods are available on every instance of that class.',
              points: [
                { term: 'existing class', detail: 'You can extend classes such as NSString that you did not write and cannot modify.' },
                { term: 'category name', detail: 'The name in parentheses labels the group of added methods and documents their purpose.' },
                { term: 'runtime addition', detail: 'The methods are merged into the class at load time so all instances gain them.' },
                { term: 'no new storage', detail: 'A category can add methods but cannot add instance variables to the class.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "objc-class-extensions",
        title: "Class Extensions",
        level: 2,
        slug: "class-extensions",
        concepts: [
          {
            id: "objc-extension-private",
            code: "// In Person.m, above @implementation\n@interface Person ()\n@property (nonatomic, strong) NSMutableArray *log;\n- (void)internalReset;\n@end",
            note: "A class extension is an anonymous category `()` declared in the implementation file. It is used to add private properties and methods not exposed in the public header. Unlike a named category, it can declare storage and must be implemented in the main `@implementation`.",
            explanation: {
              heading: 'Private members via extensions',
              intro: 'A class extension is a category with empty parentheses that lives in the implementation file rather than the header. It hides properties and helper methods that callers should not see while still letting the class use them internally.',
              points: [
                { term: 'anonymous category', detail: 'The empty parentheses mark an extension rather than a named category.' },
                { term: 'private surface', detail: 'Members declared here are visible only within the implementation file, keeping the public header clean.' },
                { term: 'can add storage', detail: 'Unlike a named category, an extension may declare new properties and instance variables.' },
                { term: 'same implementation', detail: 'Its methods must be defined in the main at-implementation block of the class.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 7. Protocols
  {
    id: "objc-protocols",
    title: "Protocols",
    level: 1,
    slug: "protocols",
    concepts: [],
    children: [
      {
        id: "objc-protocol-basics",
        title: "Defining & Adopting",
        level: 2,
        slug: "protocol-basics",
        concepts: [
          {
            id: "objc-protocol-def",
            code: "@protocol Drawable <NSObject>\n- (void)draw;                 // required by default\n@optional\n- (void)prepare;              // optional method\n@end\n\n@interface Circle : NSObject <Drawable>\n@end",
            note: "A protocol declares a set of methods a class promises to provide, similar to an interface in other languages. Methods are required unless placed under `@optional`. A class adopts one or more protocols by listing them in angle brackets after its superclass.",
            explanation: {
              heading: 'Declaring and adopting protocols',
              intro: 'A protocol lists methods that an adopting class agrees to implement, acting like an interface contract that is independent of the class hierarchy. A class advertises the contracts it fulfills by naming them in angle brackets.',
              points: [
                { term: 'protocol', detail: 'The at-protocol block names a set of methods that conforming classes promise to provide.' },
                { term: 'required by default', detail: 'Methods are mandatory unless they appear after the at-optional marker.' },
                { term: 'optional methods', detail: 'Methods under at-optional may be skipped by a conforming class.' },
                { term: 'adoption', detail: 'Listing a protocol in angle brackets after the superclass declares that the class conforms to it.' },
              ],
            },
          },
          {
            id: "objc-protocol-conform",
            code: "id<Drawable> shape = [Circle new];\nif ([shape conformsToProtocol:@protocol(Drawable)]) {\n  [shape draw];\n}",
            note: "The type `id<Drawable>` means any object that conforms to the protocol, regardless of its class. Check conformance at runtime with `conformsToProtocol:` and method availability with `respondsToSelector:`. Protocols enable polymorphism without a shared base class.",
            explanation: {
              heading: 'Typing and checking conformance',
              intro: 'Protocols let you refer to an object by the behavior it supports rather than its concrete class. The id-with-protocol type accepts any conforming object, and runtime checks confirm what a given object can actually do.',
              points: [
                { term: 'protocol qualified id', detail: 'The id in angle brackets accepts any object, of any class, that conforms to the named protocol.' },
                { term: 'conformsToProtocol', detail: 'This check asks at runtime whether an object claims to adopt a protocol.' },
                { term: 'respondsToSelector', detail: 'This check confirms an object actually implements a specific method before you call it.' },
                { term: 'polymorphism', detail: 'Different classes can be used interchangeably through a shared protocol without any common superclass.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "objc-delegation",
        title: "Delegation",
        level: 2,
        slug: "delegation",
        concepts: [
          {
            id: "objc-delegate-pattern",
            code: "@protocol DownloadDelegate <NSObject>\n- (void)downloadDidFinish:(NSData *)data;\n@end\n\n@interface Downloader : NSObject\n@property (nonatomic, weak) id<DownloadDelegate> delegate;\n@end",
            note: "Delegation lets one object hand off decisions or events to another via a protocol. The delegate property is declared `weak` to avoid a retain cycle between the two objects. When work completes, the source calls the delegate's methods to notify it.",
            explanation: {
              heading: 'The delegation pattern',
              intro: 'Delegation lets one object pass responsibility for certain decisions or events to a helper object that conforms to a protocol. The source keeps a reference to its delegate and calls back into it when something happens.',
              points: [
                { term: 'protocol contract', detail: 'A delegate protocol defines the callback methods the delegate can receive.' },
                { term: 'weak delegate', detail: 'The delegate property is weak so the two objects do not retain each other and leak.' },
                { term: 'callbacks', detail: 'When work finishes the source sends the protocol methods to notify the delegate.' },
                { term: 'loose coupling', detail: 'The source needs only the protocol, so any conforming object can act as its delegate.' },
              ],
            },
          },
          {
            id: "objc-delegate-callback",
            code: "// Inside Downloader, after finishing:\nif ([self.delegate respondsToSelector:@selector(downloadDidFinish:)]) {\n  [self.delegate downloadDidFinish:data];\n}",
            note: "Before calling an optional delegate method, check `respondsToSelector:` so a delegate that skipped it does not crash. This guard makes delegate protocols flexible. Delegation is the backbone of many Cocoa and UIKit APIs.",
            explanation: {
              heading: 'Guarding optional callbacks',
              intro: 'Optional protocol methods may be missing on a given delegate, so calling one blindly could crash. Checking respondsToSelector first makes the call safe and keeps optional methods truly optional.',
              points: [
                { term: 'selector literal', detail: 'The at-selector expression names the method to test as a runtime selector value.' },
                { term: 'safety check', detail: 'Only call the delegate method when respondsToSelector reports the delegate implements it.' },
                { term: 'flexible protocols', detail: 'This guard lets delegates implement just the callbacks they care about.' },
                { term: 'framework pattern', detail: 'Cocoa and UIKit rely on this same guarded delegation throughout their APIs.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 8. Memory Management & ARC
  {
    id: "objc-memory",
    title: "Memory Management & ARC",
    level: 1,
    slug: "memory",
    concepts: [],
    children: [
      {
        id: "objc-arc",
        title: "ARC & Ownership",
        level: 2,
        slug: "arc",
        concepts: [
          {
            id: "objc-arc-basics",
            code: "__strong Person *owner = [Person new]; // default; keeps alive\n__weak Person *observer = owner;        // does not keep alive\n// when owner goes out of scope, the object is deallocated",
            note: "Automatic Reference Counting inserts retain and release calls for you at compile time. A `__strong` reference (the default) keeps an object alive; when the last one disappears the object is freed. `__weak` references do not extend lifetime and become nil automatically when the object is gone.",
            explanation: {
              heading: 'How ARC tracks ownership',
              intro: 'Automatic reference counting frees you from writing retain and release by inserting those calls at compile time. Each object stays alive while at least one strong reference points to it and is deallocated once the last one goes away.',
              points: [
                { term: 'compile time', detail: 'ARC analyzes your code and inserts the memory management calls so you do not write them by hand.' },
                { term: 'strong default', detail: 'A strong reference is the default and keeps its target alive as long as it exists.' },
                { term: 'weak reference', detail: 'A weak reference does not keep the object alive and is set to nil automatically when the object is freed.' },
                { term: 'automatic dealloc', detail: 'When the strong count reaches zero the object is deallocated right away.' },
              ],
            },
          },
          {
            id: "objc-retain-cycles",
            code: "// Parent holds child strongly; child holds parent weakly\n@interface Node : NSObject\n@property (nonatomic, strong) Node *child;\n@property (nonatomic, weak) Node *parent;\n@end",
            note: "A retain cycle occurs when two objects hold strong references to each other, so neither is ever freed, causing a memory leak. Break the cycle by making one direction `weak`, as with parent-child links here. Blocks capturing `self` are a frequent source of cycles.",
            explanation: {
              heading: 'Breaking retain cycles',
              intro: 'A retain cycle happens when two objects each hold the other strongly, so their reference counts never fall to zero and the memory leaks. Making one of the two references weak breaks the loop and lets both objects be freed.',
              points: [
                { term: 'the cycle', detail: 'Two mutually strong references keep each object alive forever, even after the rest of the program lets go.' },
                { term: 'weak link', detail: 'Declaring one direction weak, such as parent here, removes it from the retain count and breaks the cycle.' },
                { term: 'parent child', detail: 'A common shape is a parent that owns its child strongly while the child points back weakly.' },
                { term: 'blocks and self', detail: 'A block that captures self strongly while self retains the block is another frequent source of cycles.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 9. Blocks
  {
    id: "objc-blocks",
    title: "Blocks",
    level: 1,
    slug: "blocks",
    concepts: [],
    children: [
      {
        id: "objc-blocks-basics",
        title: "Block Syntax",
        level: 2,
        slug: "blocks-basics",
        concepts: [
          {
            id: "objc-block-def",
            code: "int (^add)(int, int) = ^(int a, int b) {\n  return a + b;\n};\nint sum = add(3, 4); // 7",
            note: "A block is a chunk of code you can store and call later, similar to a closure. The declaration `int (^add)(int, int)` reads as a block taking two ints and returning an int, and `^{...}` is the block literal. Blocks are heavily used for completion handlers and callbacks.",
            explanation: {
              heading: 'Blocks as stored code',
              intro: 'A block packages a piece of code together with the variables it uses so it can be stored in a variable and called later, much like a closure. The caret symbol marks both the block type and the block body.',
              points: [
                { term: 'block type', detail: 'The caret inside the declaration names a variable that holds a block with a given parameter and return type.' },
                { term: 'block literal', detail: 'The caret followed by a body is the literal that defines the code the block runs.' },
                { term: 'call like a function', detail: 'Once assigned, a block is invoked with parentheses just like a C function pointer.' },
                { term: 'callbacks', detail: 'Blocks are the common way to pass completion handlers and callbacks to framework APIs.' },
              ],
            },
          },
          {
            id: "objc-block-capture",
            code: "__block int counter = 0;\nvoid (^increment)(void) = ^{\n  counter++;   // __block makes it mutable in the block\n};\nincrement();\nincrement();\n// counter is now 2",
            note: "Blocks capture surrounding variables by value at creation time. To let a block modify a captured variable, mark it `__block`, which shares the storage instead of copying it. When capturing `self`, use a weak reference to avoid retain cycles.",
            explanation: {
              heading: 'Capturing variables in blocks',
              intro: 'By default a block copies the current value of each surrounding variable it uses, freezing it at the moment the block is created. Marking a variable with the block storage qualifier instead shares the actual storage so changes persist.',
              points: [
                { term: 'capture by value', detail: 'Ordinary captured variables are copied into the block and cannot be changed from inside it.' },
                { term: 'block qualifier', detail: 'The block storage qualifier makes a variable shared so the block can read and write the live value.' },
                { term: 'shared storage', detail: 'A qualified variable lives in shared memory that both the block and the surrounding code see.' },
                { term: 'weak self', detail: 'When a block needs self, capturing a weak reference avoids the retain cycle that a strong capture would create.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "objc-gcd",
        title: "Grand Central Dispatch",
        level: 2,
        slug: "gcd",
        concepts: [
          {
            id: "objc-gcd-async",
            code: "dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{\n  NSData *data = [self loadFromNetwork];\n  dispatch_async(dispatch_get_main_queue(), ^{\n    [self updateUIWithData:data];\n  });\n});",
            note: "Grand Central Dispatch schedules blocks onto queues instead of managing threads directly. Run expensive work on a background global queue with `dispatch_async`, then hop back to the main queue for any UI updates, since UIKit must be touched on the main thread.",
            explanation: {
              heading: 'Dispatching work to queues',
              intro: 'Grand Central Dispatch lets you submit blocks to queues and leaves the thread management to the system. Heavy work goes to a background queue, and any user interface update is dispatched back to the main queue.',
              points: [
                { term: 'queues not threads', detail: 'You hand blocks to queues and the system decides which thread runs them.' },
                { term: 'async background', detail: 'Dispatching to a global queue runs slow work off the main thread so the interface stays responsive.' },
                { term: 'main queue for UI', detail: 'UIKit must be used on the main thread, so results are dispatched back to the main queue before touching views.' },
                { term: 'nesting', detail: 'Nesting a main queue dispatch inside a background block is the standard load-then-update pattern.' },
              ],
            },
            example: "// Nested dispatch_async: work off-main, then update on-main",
          },
          {
            id: "objc-gcd-once",
            code: "+ (instancetype)shared {\n  static id instance = nil;\n  static dispatch_once_t token;\n  dispatch_once(&token, ^{\n    instance = [[self alloc] init];\n  });\n  return instance;\n}",
            note: "`dispatch_once` runs its block exactly one time for the lifetime of the process, even across threads, using a token to remember completion. It is the canonical thread-safe way to build a singleton in Objective-C.",
            explanation: {
              heading: 'One-time thread-safe setup',
              intro: 'The dispatch once function guarantees its block runs a single time no matter how many threads reach it. A static token records that the work is done, making it the standard way to create a shared singleton safely.',
              points: [
                { term: 'run once', detail: 'The block executes only the first time through and is skipped on every later call.' },
                { term: 'static token', detail: 'The token must be static so it keeps its state across every call to the method.' },
                { term: 'thread safe', detail: 'Concurrent callers are coordinated so the block never runs twice, even under a race.' },
                { term: 'singleton idiom', detail: 'Assigning the shared instance inside the block is the canonical singleton pattern.' },
              ],
            },
            example: "// The static token must persist between calls",
          },
        ],
        children: [],
      },
    ],
  },

  // 10. Foundation Collections
  {
    id: "objc-collections",
    title: "Foundation Collections",
    level: 1,
    slug: "collections",
    concepts: [],
    children: [
      {
        id: "objc-arrays",
        title: "NSArray & NSMutableArray",
        level: 2,
        slug: "arrays",
        concepts: [
          {
            id: "objc-nsarray-basic",
            code: "NSArray *fruits = @[@\"apple\", @\"banana\", @\"cherry\"];\nNSString *first = fruits[0];        // 'apple'\nNSUInteger count = fruits.count;    // 3\nBOOL has = [fruits containsObject:@\"banana\"];",
            note: "`NSArray` is an ordered, immutable collection of objects created with the `@[...]` literal. Access elements by subscript and query with methods like `count` and `containsObject:`. Because it holds objects, primitives must be boxed in `NSNumber` first.",
            explanation: {
              heading: 'Immutable ordered arrays',
              intro: 'NSArray stores an ordered list of objects that cannot change once created, and the bracket literal builds one concisely. It offers subscript access and query methods, but only holds objects, so plain numbers must be wrapped first.',
              points: [
                { term: 'array literal', detail: 'The at-bracket syntax creates an NSArray from a comma separated list of objects.' },
                { term: 'subscripting', detail: 'Indexing with square brackets returns the object at that position.' },
                { term: 'query methods', detail: 'Methods like count and containsObject inspect the contents without changing them.' },
                { term: 'objects only', detail: 'Primitives such as int must be boxed in NSNumber before they can be stored.' },
              ],
            },
          },
          {
            id: "objc-nsmutablearray",
            code: "NSMutableArray *items = [NSMutableArray array];\n[items addObject:@\"first\"];\n[items insertObject:@\"zero\" atIndex:0];\n[items removeObjectAtIndex:1];",
            note: "`NSMutableArray` is the editable variant, letting you add, insert, and remove elements after creation. Reach for the mutable version only when you actually need to change the contents. The immutable `NSArray` is safer to pass around and share.",
            explanation: {
              heading: 'Editable arrays',
              intro: 'NSMutableArray is the changeable cousin of NSArray, supporting insertion, removal, and replacement after the collection exists. You should prefer the immutable form and only use the mutable one when the contents genuinely need to change.',
              points: [
                { term: 'add and insert', detail: 'Methods like addObject and insertObject atIndex grow the array at the end or at a chosen position.' },
                { term: 'remove', detail: 'Methods such as removeObjectAtIndex delete elements after creation.' },
                { term: 'subclass', detail: 'NSMutableArray is a subclass of NSArray, so it works anywhere an NSArray is expected.' },
                { term: 'prefer immutable', detail: 'Immutable arrays are safer to share because no one can change them behind your back.' },
              ],
            },
          },
          {
            id: "objc-enumerate-block",
            code: "[fruits enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {\n  NSLog(@\"%lu: %@\", (unsigned long)idx, obj);\n  if (idx == 1) *stop = YES;   // break out early\n}];",
            note: "`enumerateObjectsUsingBlock:` iterates a collection while giving you both the element and its index in the block. Setting the `stop` pointer to YES ends the enumeration early, the block-based equivalent of a break statement.",
            explanation: {
              heading: 'Block-based enumeration',
              intro: 'The enumerate objects using block method walks a collection and calls your block once per element, passing both the object and its index. It also gives you a way to stop early without a traditional loop.',
              points: [
                { term: 'object and index', detail: 'The block receives each element together with its position, so you do not track an index yourself.' },
                { term: 'stop pointer', detail: 'Setting the stop boolean through its pointer to YES ends the enumeration immediately.' },
                { term: 'break equivalent', detail: 'Setting stop plays the same role that a break statement would in a normal loop.' },
                { term: 'reverse option', detail: 'A related variant accepts an option to walk the collection back to front.' },
              ],
            },
            example: "// A reverse variant takes NSEnumerationReverse as an option",
          },
        ],
        children: [],
      },
      {
        id: "objc-dictionaries",
        title: "NSDictionary",
        level: 2,
        slug: "dictionaries",
        concepts: [
          {
            id: "objc-nsdictionary-basic",
            code: "NSDictionary *ages = @{@\"alice\": @30, @\"bob\": @25};\nNSNumber *a = ages[@\"alice\"];   // 30\nNSArray *keys = ages.allKeys;\n\nNSMutableDictionary *m = [NSMutableDictionary dictionary];\nm[@\"key\"] = @\"value\";",
            note: "`NSDictionary` maps unique keys to object values using the `@{key: value}` literal, with subscript access by key. The mutable variant supports adding and removing pairs. Numeric values are boxed as `NSNumber`, hence `@30` rather than `30`.",
            explanation: {
              heading: 'Key to value mapping',
              intro: 'NSDictionary stores an unordered set of unique keys, each paired with an object value, built with the brace literal. You look values up by key with subscripting, and the mutable variant lets you add or remove pairs.',
              points: [
                { term: 'dictionary literal', detail: 'The at-brace syntax pairs each key with a value separated by a colon.' },
                { term: 'key subscript', detail: 'Indexing with a key returns the associated value or nil when the key is absent.' },
                { term: 'boxed numbers', detail: 'Numeric values must be NSNumber objects, so a literal thirty is written with a leading at sign.' },
                { term: 'mutable variant', detail: 'NSMutableDictionary supports assigning through a key subscript to add or replace pairs.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "objc-nsnumber",
        title: "NSNumber & Boxing",
        level: 2,
        slug: "nsnumber",
        concepts: [
          {
            id: "objc-nsnumber-boxing",
            code: "NSNumber *n = @42;              // boxed int literal\nNSNumber *pi = @3.14;           // boxed double\nNSNumber *flag = @YES;          // boxed BOOL\nNSNumber *expr = @(3 + 4);      // box any expression",
            note: "Collections store objects, not primitives, so numbers must be wrapped in `NSNumber`. The `@` boxing syntax turns a literal or a parenthesized `@(...)` expression into an object, replacing the older `[NSNumber numberWithInt:]` calls.",
            explanation: {
              heading: 'Boxing primitives into objects',
              intro: 'Because collections hold only objects, a primitive number must be wrapped in an NSNumber before it can be stored. The at-sign boxing syntax turns literals and expressions into these wrapper objects concisely.',
              points: [
                { term: 'literal boxing', detail: 'Placing an at sign before a numeric literal creates an NSNumber holding that value.' },
                { term: 'boolean boxing', detail: 'The same syntax wraps a boolean, producing an NSNumber for YES or NO.' },
                { term: 'expression boxing', detail: 'The at-parenthesis form evaluates the expression inside and boxes the result at runtime.' },
                { term: 'replaces old calls', detail: 'This concise syntax supersedes the older numberWithInt style factory methods.' },
              ],
            },
            example: "// @(someVariable) boxes a runtime value",
          },
          {
            id: "objc-nsnumber-unbox",
            code: "NSNumber *n = @42;\nint i = [n intValue];          // 42\ndouble d = [n doubleValue];    // 42.0\nBOOL equal = [n isEqualToNumber:@42];  // compare by value",
            note: "Retrieve the primitive back with typed accessors like `intValue` or `doubleValue`, which also convert between numeric types. Compare two NSNumbers with `isEqualToNumber:` rather than `==`, since `==` would compare object pointers.",
            explanation: {
              heading: 'Unboxing and comparing numbers',
              intro: 'To use a boxed value in arithmetic you ask the NSNumber for its primitive form through a typed accessor. Comparing two NSNumbers must be done by value, since the equality operator would only compare their pointers.',
              points: [
                { term: 'typed accessors', detail: 'Methods such as intValue and doubleValue return the stored number as the requested primitive type.' },
                { term: 'type conversion', detail: 'These accessors also convert, so a boxed double can be read back as an int.' },
                { term: 'value equality', detail: 'The isEqualToNumber method compares the numeric contents rather than object identity.' },
                { term: 'avoid pointer compare', detail: 'The double equals operator compares pointers, which can wrongly report two equal numbers as different.' },
              ],
            },
            example: "// [@1 compare:@2] returns NSOrderedAscending",
          },
        ],
        children: [],
      },
    ],
  },

  // 11. Strings & Fast Enumeration
  {
    id: "objc-strings-enumeration",
    title: "Strings & Fast Enumeration",
    level: 1,
    slug: "strings-enumeration",
    concepts: [],
    children: [
      {
        id: "objc-nsstring",
        title: "Working with NSString",
        level: 2,
        slug: "nsstring",
        concepts: [
          {
            id: "objc-nsstring-methods",
            code: "NSString *s = @\"Hello, Objective-C\";\ns.length;                                 // 18\n[s uppercaseString];                      // 'HELLO, OBJECTIVE-C'\n[s hasPrefix:@\"Hello\"];                   // YES\n[s componentsSeparatedByString:@\", \"];    // array of parts",
            note: "`NSString` is immutable and offers rich methods for inspecting and transforming text, all returning new strings. Compare strings by content with `isEqualToString:`, never with `==`, which compares pointers. Use `NSMutableString` when you must build text incrementally.",
            explanation: {
              heading: 'Inspecting and transforming text',
              intro: 'NSString values cannot change, so every transforming method returns a brand new string rather than editing in place. It provides many methods to query and reshape text, and content comparison must use the dedicated method.',
              points: [
                { term: 'immutable', detail: 'Transforming methods such as uppercaseString return a new string and leave the original untouched.' },
                { term: 'rich methods', detail: 'Methods query length, test prefixes, and split text into components.' },
                { term: 'content equality', detail: 'Compare text with isEqualToString, since the double equals operator only checks pointer identity.' },
                { term: 'mutable building', detail: 'Use NSMutableString when you need to append or edit text piece by piece.' },
              ],
            },
          },
          {
            id: "objc-string-format",
            code: "NSString *name = @\"Ada\";\nNSInteger msgs = 3;\nNSString *msg = [NSString stringWithFormat:@\"%@ has %ld messages\", name, (long)msgs];",
            note: "`stringWithFormat:` builds a string from a format template and arguments, using `%@` for objects and C specifiers for primitives. Cast integer types to match the specifier to avoid warnings across platforms. This is the standard way to compose dynamic text.",
            explanation: {
              heading: 'Composing strings from a template',
              intro: 'The stringWithFormat method assembles a new NSString by substituting arguments into a template of placeholders. It mixes the object placeholder with the same C style specifiers used by printf.',
              points: [
                { term: 'template', detail: 'The format string holds placeholders that mark where each argument is inserted.' },
                { term: 'object placeholder', detail: 'The percent-at placeholder inserts any object by asking it for its description.' },
                { term: 'cast integers', detail: 'Cast integer arguments to match their specifier so the width is correct on every platform.' },
                { term: 'standard builder', detail: 'This method is the usual way to build dynamic text from mixed values.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "objc-fast-enumeration",
        title: "Fast Enumeration",
        level: 2,
        slug: "fast-enumeration",
        concepts: [
          {
            id: "objc-for-in",
            code: "NSArray *names = @[@\"a\", @\"b\", @\"c\"];\nfor (NSString *name in names) {\n  NSLog(@\"%@\", name);\n}\n\nfor (NSString *key in dictionary) {\n  NSLog(@\"%@ = %@\", key, dictionary[key]);\n}",
            note: "Fast enumeration with `for (Type x in collection)` iterates over the elements of any collection efficiently and readably. Iterating a dictionary yields its keys. You must not modify a collection while enumerating it, or the loop will raise an exception.",
            explanation: {
              heading: 'The for-in loop',
              intro: 'Fast enumeration provides a concise for-in loop that walks the elements of any Foundation collection efficiently. It reads cleanly and avoids manual index bookkeeping, but it forbids changing the collection mid-loop.',
              points: [
                { term: 'for-in form', detail: 'The loop names a variable and the collection, binding the variable to each element in turn.' },
                { term: 'dictionary keys', detail: 'Enumerating a dictionary yields its keys, which you then use to look up values.' },
                { term: 'no mutation', detail: 'Changing the collection while enumerating raises an exception, so collect changes and apply them after.' },
                { term: 'efficient', detail: 'Fast enumeration is optimized internally and is faster than repeated index access.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "objc-dates",
        title: "Dates & Formatting",
        level: 2,
        slug: "dates",
        concepts: [
          {
            id: "objc-nsdate-basic",
            code: "NSDate *now = [NSDate date];\nNSDate *later = [now dateByAddingTimeInterval:3600]; // +1 hour\nNSTimeInterval secs = [later timeIntervalSinceDate:now]; // 3600\nif ([later compare:now] == NSOrderedDescending) { /* later is after now */ }",
            note: "`NSDate` represents an absolute point in time as seconds since a reference date. Do arithmetic with `dateByAddingTimeInterval:` and measure gaps with `timeIntervalSinceDate:`. Order two dates with `compare:`, which returns an `NSComparisonResult`.",
            explanation: {
              heading: 'Working with points in time',
              intro: 'NSDate captures a single absolute moment measured as seconds from a fixed reference date. You do date math by adding intervals, measure gaps between dates, and order two dates with a comparison method.',
              points: [
                { term: 'absolute time', detail: 'A date is stored as a count of seconds relative to a fixed reference instant.' },
                { term: 'add interval', detail: 'The dateByAddingTimeInterval method returns a new date offset by a number of seconds.' },
                { term: 'measure gap', detail: 'The timeIntervalSinceDate method returns the difference between two dates in seconds.' },
                { term: 'compare', detail: 'The compare method returns an ordered result telling you which date comes first.' },
              ],
            },
            example: "// NSTimeInterval is just a double number of seconds",
          },
          {
            id: "objc-nsdateformatter",
            code: "NSDateFormatter *fmt = [[NSDateFormatter alloc] init];\nfmt.dateFormat = @\"yyyy-MM-dd HH:mm\";\nfmt.locale = [NSLocale localeWithLocaleIdentifier:@\"en_US_POSIX\"];\nNSString *text = [fmt stringFromDate:[NSDate date]];\nNSDate *parsed = [fmt dateFromString:@\"2024-06-01 09:30\"];",
            note: "`NSDateFormatter` converts between `NSDate` and text using a pattern string. Use the `en_US_POSIX` locale for fixed machine-readable formats so user locale settings do not alter the output. Formatters are relatively expensive, so reuse them rather than recreating per call.",
            explanation: {
              heading: 'Formatting and parsing dates',
              intro: 'NSDateFormatter translates between NSDate objects and their text form using a pattern that describes each field. It respects locale, which matters greatly when a stable machine-readable format is required.',
              points: [
                { term: 'pattern string', detail: 'The dateFormat property describes the year, month, day, and time layout of the text.' },
                { term: 'posix locale', detail: 'Using the en US POSIX locale keeps fixed formats stable regardless of the user region settings.' },
                { term: 'both directions', detail: 'The formatter can turn a date into a string and parse a string back into a date.' },
                { term: 'reuse', detail: 'Creating a formatter is costly, so keep one around and reuse it rather than making a new one each call.' },
              ],
            },
            example: "// Reuse a single formatter instance for performance",
          },
        ],
        children: [],
      },
    ],
  },

  // 12. KVC & KVO
  {
    id: "objc-kvc-kvo",
    title: "KVC & KVO",
    level: 1,
    slug: "kvc-kvo",
    concepts: [],
    children: [
      {
        id: "objc-kvc",
        title: "Key-Value Coding",
        level: 2,
        slug: "kvc",
        concepts: [
          {
            id: "objc-kvc-basic",
            code: "Person *p = [Person new];\n[p setValue:@\"Ada\" forKey:@\"name\"];\nNSString *n = [p valueForKey:@\"name\"]; // 'Ada'\nNSArray *names = [people valueForKeyPath:@\"name\"];",
            note: "Key-Value Coding accesses properties indirectly by string name with `valueForKey:` and `setValue:forKey:`. A key path like `@\"address.city\"` drills through nested objects, and applying a key path to an array collects that property from each element. KVC underpins bindings and generic data handling.",
            explanation: {
              heading: 'Accessing properties by name',
              intro: 'Key-Value Coding lets you read and write a property using its name as a string rather than a direct accessor call. This indirection powers generic data handling, bindings, and drilling through nested objects with key paths.',
              points: [
                { term: 'value for key', detail: 'The valueForKey method returns a property looked up by its string name.' },
                { term: 'set value for key', detail: 'The setValue forKey method writes a property chosen at runtime by name.' },
                { term: 'key paths', detail: 'A dotted key path drills through nested objects, following one property to reach another.' },
                { term: 'collection operators', detail: 'Applying a key path to an array gathers that property from every element into a new array.' },
              ],
            },
          },
        ],
        children: [],
      },
      {
        id: "objc-kvo",
        title: "Key-Value Observing",
        level: 2,
        slug: "kvo",
        concepts: [
          {
            id: "objc-kvo-basic",
            code: "[account addObserver:self\n          forKeyPath:@\"balance\"\n             options:NSKeyValueObservingOptionNew\n             context:NULL];\n\n- (void)observeValueForKeyPath:(NSString *)keyPath\n                      ofObject:(id)object\n                        change:(NSDictionary *)change\n                       context:(void *)context {\n  NSLog(@\"balance changed to %@\", change[NSKeyValueChangeNewKey]);\n}",
            note: "Key-Value Observing lets an object be notified automatically when another object's property changes. Register with `addObserver:forKeyPath:options:context:` and handle updates in `observeValueForKeyPath:...`. Always remove the observer when done to avoid crashes from notifications sent to a deallocated observer.",
            explanation: {
              heading: 'Observing property changes',
              intro: 'Key-Value Observing notifies an observer automatically whenever a watched property on another object changes. It builds directly on Key-Value Coding, so it works for any property accessed by key.',
              points: [
                { term: 'register', detail: 'The addObserver forKeyPath method subscribes an observer to changes of a named property.' },
                { term: 'options', detail: 'Options such as the new value flag control what change information is delivered.' },
                { term: 'callback', detail: 'Changes arrive in observeValueForKeyPath, where the change dictionary carries the updated value.' },
                { term: 'remove observer', detail: 'You must unregister before the observer is deallocated, or a later change will crash the app.' },
              ],
            },
          },
        ],
        children: [],
      },
    ],
  },

  // 13. Notifications
  {
    id: "objc-notifications",
    title: "Notifications",
    level: 1,
    slug: "notifications",
    concepts: [],
    children: [
      {
        id: "objc-notification-center",
        title: "NSNotificationCenter",
        level: 2,
        slug: "notification-center",
        concepts: [
          {
            id: "objc-notification-observe",
            code: "[[NSNotificationCenter defaultCenter]\n    addObserver:self\n      selector:@selector(onLogin:)\n          name:@\"UserDidLogIn\"\n        object:nil];\n\n- (void)onLogin:(NSNotification *)note {\n  NSLog(@\"user: %@\", note.userInfo[@\"user\"]);\n}",
            note: "`NSNotificationCenter` is a broadcast hub that decouples senders from receivers: observers register for a named notification and get called when it is posted. Passing `object:nil` listens to the notification from any sender. The notification carries an optional `userInfo` dictionary.",
            explanation: {
              heading: 'Broadcasting to observers',
              intro: 'NSNotificationCenter is a central hub that lets senders broadcast named events without knowing who is listening. Observers register for a notification name and receive a callback whenever a matching notification is posted.',
              points: [
                { term: 'register observer', detail: 'The addObserver selector name method subscribes an object to a named notification.' },
                { term: 'any sender', detail: 'Passing nil for the object argument listens for the notification from every sender.' },
                { term: 'user info', detail: 'Each notification can carry a userInfo dictionary of extra data for the observer.' },
                { term: 'decoupling', detail: 'Senders and receivers never reference each other directly, which loosens their coupling.' },
              ],
            },
            example: "// One notification can have many independent observers",
          },
          {
            id: "objc-notification-post-remove",
            code: "[[NSNotificationCenter defaultCenter]\n    postNotificationName:@\"UserDidLogIn\"\n                  object:self\n                userInfo:@{@\"user\": currentUser}];\n\n// In dealloc (pre-iOS 9) or when done:\n[[NSNotificationCenter defaultCenter] removeObserver:self];",
            note: "Post a notification with `postNotificationName:object:userInfo:`, attaching any payload in the userInfo dictionary. On older systems you must remove observers before they are deallocated to prevent crashes; block-based observers must be removed by their returned token.",
            explanation: {
              heading: 'Posting and cleaning up',
              intro: 'Sending a notification broadcasts it to every registered observer, optionally carrying a payload dictionary. Cleaning up observers is important on older systems where a lingering observer can cause a crash.',
              points: [
                { term: 'post', detail: 'The postNotificationName object userInfo method broadcasts the event with its optional payload.' },
                { term: 'payload', detail: 'The userInfo dictionary carries any data observers need, such as the current user here.' },
                { term: 'remove observers', detail: 'On older systems removeObserver must run before an observer is deallocated to avoid a crash.' },
                { term: 'one to many', detail: 'Unlike delegation, a single notification can reach many independent observers at once.' },
              ],
            },
            example: "// Unlike delegation, notifications are one-to-many",
          },
        ],
        children: [],
      },
    ],
  },

  // 14. Error Handling
  {
    id: "objc-error-handling",
    title: "Error Handling",
    level: 1,
    slug: "error-handling",
    concepts: [],
    children: [
      {
        id: "objc-nserror",
        title: "NSError Pattern",
        level: 2,
        slug: "nserror",
        concepts: [
          {
            id: "objc-nserror-out-param",
            code: "NSError *error = nil;\nNSString *contents = [NSString stringWithContentsOfFile:path\n                                              encoding:NSUTF8StringEncoding\n                                                 error:&error];\nif (!contents) {\n  NSLog(@\"failed: %@ (%ld)\", error.localizedDescription, (long)error.code);\n}",
            note: "The idiomatic way to report recoverable failures is an `NSError **` out-parameter. Check the method's actual return value (nil or NO) to detect failure, then inspect the populated error; do not test the error variable alone, as it may be left set on success.",
            explanation: {
              heading: 'The NSError out-parameter',
              intro: 'Recoverable failures in Objective-C are reported through an error out-parameter rather than exceptions. The caller passes the address of an error variable and checks the method return value to decide whether a failure occurred.',
              points: [
                { term: 'out parameter', detail: 'The method takes a pointer to an error variable and fills it in only when something goes wrong.' },
                { term: 'check return first', detail: 'Detect failure from the primary return value being nil or NO, not from the error variable.' },
                { term: 'inspect error', detail: 'After a failure, read the populated error for its description and code.' },
                { term: 'do not trust error alone', detail: 'The error variable may be left set even on success, so it is not a reliable failure signal by itself.' },
              ],
            },
            example: "// Pass &error and check the primary return, not error itself",
          },
          {
            id: "objc-nserror-create",
            code: "if (badInput) {\n  if (error) {\n    *error = [NSError errorWithDomain:@\"com.app.parser\"\n                                 code:42\n                             userInfo:@{NSLocalizedDescriptionKey: @\"Bad input\"}];\n  }\n  return NO;\n}",
            note: "To surface an error from your own method, build an `NSError` with a domain string, a numeric code, and a userInfo dictionary carrying a human-readable message. Guard the assignment with `if (error)` because callers may pass NULL when they do not care about the details.",
            explanation: {
              heading: 'Producing an NSError',
              intro: 'When your own method fails it should construct an NSError describing what went wrong and hand it back through the out-parameter. The error combines a domain, a code, and a dictionary with a readable message.',
              points: [
                { term: 'domain', detail: 'The domain string groups related errors, usually a reverse dns identifier for your component.' },
                { term: 'code', detail: 'The numeric code distinguishes specific failures within that domain.' },
                { term: 'localized description', detail: 'The userInfo dictionary carries a human-readable message under the localized description key.' },
                { term: 'guard the pointer', detail: 'Wrap the assignment in an if error check because callers may pass NULL when they ignore the error.' },
              ],
            },
            example: "// Return NO/nil AND set *error to signal failure",
          },
        ],
        children: [],
      },
      {
        id: "objc-exceptions",
        title: "Exceptions",
        level: 2,
        slug: "exceptions",
        concepts: [
          {
            id: "objc-try-catch",
            code: "@try {\n  NSArray *a = @[@1];\n  id x = a[5];              // out of bounds -> exception\n}\n@catch (NSException *e) {\n  NSLog(@\"%@: %@\", e.name, e.reason);\n}\n@finally {\n  NSLog(@\"cleanup always runs\");\n}",
            note: "`@try`/`@catch`/`@finally` handles `NSException`, which signals programmer errors like out-of-bounds access. The `@finally` block always runs for cleanup. In Objective-C, exceptions are reserved for unrecoverable bugs; use NSError for expected failures.",
            explanation: {
              heading: 'Catching exceptions',
              intro: 'The try, catch, and finally blocks handle an NSException, which in Objective-C signals a programming mistake rather than an expected failure. The finally block always runs so cleanup happens whether or not an exception was thrown.',
              points: [
                { term: 'try block', detail: 'Code that might raise an exception goes inside the at-try block.' },
                { term: 'catch block', detail: 'The at-catch block receives the NSException so you can inspect its name and reason.' },
                { term: 'finally block', detail: 'The at-finally block runs in every case, making it the place for cleanup.' },
                { term: 'reserved for bugs', detail: 'Exceptions indicate unrecoverable programmer errors, while NSError handles expected failures.' },
              ],
            },
            example: "// e.name and e.reason describe the exception",
          },
          {
            id: "objc-throw",
            code: "@throw [NSException exceptionWithName:@\"InvalidStateException\"\n                               reason:@\"Buffer not initialized\"\n                             userInfo:nil];",
            note: "Raise your own exception with `@throw` and an `NSException` instance. Because exceptions indicate bugs rather than normal control flow, throwing one typically means the program is in a state it cannot safely continue from.",
            explanation: {
              heading: 'Throwing an exception',
              intro: 'You raise your own exception with the throw directive and an NSException instance that describes the problem. Throwing signals that the program has reached a state it cannot safely recover from.',
              points: [
                { term: 'throw directive', detail: 'The at-throw statement raises the given NSException up the call stack.' },
                { term: 'exception fields', detail: 'The exception carries a name and a reason that explain what went wrong.' },
                { term: 'bug signal', detail: 'Throwing usually means a precondition was violated and continuing would be unsafe.' },
                { term: 'prefer NSError', detail: 'For expected error paths return an NSError instead of throwing an exception.' },
              ],
            },
            example: "// Prefer NSError returns over @throw for expected error paths",
          },
        ],
        children: [],
      },
    ],
  },

  // 15. Copying
  {
    id: "objc-copying",
    title: "Copying Objects",
    level: 1,
    slug: "copying",
    concepts: [],
    children: [
      {
        id: "objc-copy-mutablecopy",
        title: "copy vs mutableCopy",
        level: 2,
        slug: "copy-mutablecopy",
        concepts: [
          {
            id: "objc-copy-immutable",
            code: "NSMutableArray *m = [@[@1, @2, @3] mutableCopy];\nNSArray *frozen = [m copy];        // immutable snapshot\n[m addObject:@4];                  // does not affect frozen\n// frozen still has 3 elements",
            note: "`copy` returns an immutable copy while `mutableCopy` returns a mutable one, regardless of the receiver's mutability. Copying a collection into an immutable form takes a stable snapshot, so later mutations of the original do not leak into it.",
            explanation: {
              heading: 'copy versus mutableCopy',
              intro: 'The copy and mutableCopy methods let you choose the mutability of the result regardless of the original. Copying a mutable collection into an immutable one captures a stable snapshot that later edits cannot disturb.',
              points: [
                { term: 'copy', detail: 'The copy method returns an immutable duplicate even when the receiver is mutable.' },
                { term: 'mutableCopy', detail: 'The mutableCopy method returns an editable duplicate even from an immutable receiver.' },
                { term: 'snapshot', detail: 'Freezing a mutable collection with copy preserves its current contents against later mutation.' },
                { term: 'copy of immutable', detail: 'Calling copy on an already immutable object may just retain it rather than allocate a new one.' },
              ],
            },
            example: "// copy of an already-immutable object may just retain it",
          },
          {
            id: "objc-shallow-copy",
            code: "NSArray *outer = @[[@[@1] mutableCopy]];\nNSArray *copy = [outer copy];\n[copy[0] addObject:@2];   // the shared inner array changes too",
            note: "Collection copies are shallow: the container is duplicated but its elements are shared by reference, not copied. To duplicate nested objects as well you need a deep copy, for example via `initWithArray:copyItems:YES` or archiving.",
            explanation: {
              heading: 'Shallow versus deep copies',
              intro: 'Copying a collection duplicates only the outer container while the elements inside remain shared references. Changing a shared inner object is therefore visible through both the original and the copy.',
              points: [
                { term: 'shallow copy', detail: 'The container is new but every element is the same object shared with the original.' },
                { term: 'shared elements', detail: 'Mutating a shared inner object shows up in both the original and the copied collection.' },
                { term: 'deep copy', detail: 'A deep copy duplicates the nested objects too, so the two collections become fully independent.' },
                { term: 'how to deep copy', detail: 'The initWithArray copyItems form or archiving produces a deep copy of the contents.' },
              ],
            },
            example: "// Deep copy: [[NSArray alloc] initWithArray:outer copyItems:YES]",
          },
          {
            id: "objc-nscopying-protocol",
            code: "@interface Point : NSObject <NSCopying>\n@end\n@implementation Point\n- (id)copyWithZone:(NSZone *)zone {\n  Point *p = [[[self class] allocWithZone:zone] init];\n  p->_x = _x; p->_y = _y;\n  return p;\n}\n@end",
            note: "To make your own class copyable, adopt `NSCopying` and implement `copyWithZone:`, which is what `copy` calls. Create a fresh instance and duplicate the relevant state. Conforming to NSCopying also lets instances serve as dictionary keys.",
            explanation: {
              heading: 'Making a class copyable',
              intro: 'For your own class to support the copy method it must adopt the NSCopying protocol and implement copyWithZone. That method builds a fresh instance and duplicates the state that defines the object.',
              points: [
                { term: 'adopt NSCopying', detail: 'Listing NSCopying in angle brackets declares that the class can be copied.' },
                { term: 'copyWithZone', detail: 'The copy method calls copyWithZone, where you allocate a new instance and copy the fields.' },
                { term: 'duplicate state', detail: 'Copy the relevant instance variables so the new object matches the original.' },
                { term: 'dictionary keys', detail: 'Conforming to NSCopying also lets instances be used as dictionary keys, which are copied on insertion.' },
              ],
            },
            example: "// Dictionary keys must implement NSCopying",
          },
        ],
        children: [],
      },
    ],
  },
];

export default topics;
